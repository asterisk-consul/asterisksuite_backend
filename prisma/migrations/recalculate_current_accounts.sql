-- ============================================================
-- FUNCIÓN: Recalcular cuentas corrientes
-- No borra nada, solo recalcula balance_before/balance_after
-- de cada entrada y el saldo final de cada cuenta.
-- ============================================================

CREATE OR REPLACE FUNCTION tenant.recalculate_current_accounts()
RETURNS TABLE(v_account_id UUID, v_party_type VARCHAR, v_currency VARCHAR, v_new_balance NUMERIC, v_entry_count BIGINT) AS $$
DECLARE
  v_acc_id UUID;
  v_acc_party VARCHAR;
  v_entry RECORD;
  v_running NUMERIC := 0;
  v_is_debit BOOLEAN;
  v_after NUMERIC;
  v_count BIGINT;
BEGIN
  FOR v_acc_id, v_acc_party IN 
    SELECT ca.id, ca.party_type FROM tenant.current_accounts ca
  LOOP
    v_running := 0;
    v_count := 0;
    
    FOR v_entry IN 
      SELECT e.id, e.type, e.amount 
      FROM tenant.current_account_entries e
      WHERE e.current_account_id = v_acc_id
      ORDER BY e.date ASC, e.created_at ASC
    LOOP
      v_count := v_count + 1;
      
      IF v_acc_party = 'CUSTOMER' THEN
        v_is_debit := v_entry.type IN ('CREDIT_NOTE', 'PAYMENT', 'COLLECTION');
      ELSE
        v_is_debit := v_entry.type IN ('INVOICE', 'DEBIT_NOTE', 'LOAN', 'CHECK_ISSUED', 'TRANSFER', 'DEBIT');
      END IF;
      
      v_after := CASE 
        WHEN v_is_debit THEN v_running - v_entry.amount
        ELSE v_running + v_entry.amount
      END;
      
      UPDATE tenant.current_account_entries
      SET balance_before = v_running,
          balance_after = v_after
      WHERE id = v_entry.id;
      
      v_running := v_after;
    END LOOP;
    
    UPDATE tenant.current_accounts
    SET balance = v_running, updated_at = NOW()
    WHERE id = v_acc_id;
    
    v_account_id := v_acc_id;
    v_party_type := v_acc_party;
    v_currency := (SELECT ca2.currency_code FROM tenant.current_accounts ca2 WHERE ca2.id = v_acc_id);
    v_new_balance := v_running;
    v_entry_count := v_count;
    RETURN NEXT;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- EJECUTAR RECALCULO
-- ============================================================
SELECT * FROM tenant.recalculate_current_accounts();
