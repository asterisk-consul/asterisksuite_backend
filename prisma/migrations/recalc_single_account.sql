DO $$
DECLARE
  v_acc_id UUID := 'ef29c419-af3f-4efb-b840-ad13c33280f0';
  v_acc_party VARCHAR := 'CUSTOMER';
  v_entry RECORD;
  v_running NUMERIC := 0;
  v_is_debit BOOLEAN;
  v_after NUMERIC;
BEGIN
  FOR v_entry IN 
    SELECT e.id, e.type, e.amount 
    FROM tenant.current_account_entries e
    WHERE e.current_account_id = v_acc_id
    ORDER BY e.date ASC, e.created_at ASC
  LOOP
    v_is_debit := v_entry.type IN ('CREDIT_NOTE', 'PAYMENT', 'COLLECTION');
    
    v_after := CASE 
      WHEN v_is_debit THEN v_running - v_entry.amount
      ELSE v_running + v_entry.amount
    END;
    
    UPDATE tenant.current_account_entries
    SET balance_before = v_running, balance_after = v_after
    WHERE id = v_entry.id;
    
    v_running := v_after;
  END LOOP;
  
  UPDATE tenant.current_accounts SET balance = v_running, updated_at = NOW() WHERE id = v_acc_id;
  
  RAISE NOTICE 'Nuevo balance: %', v_running;
END $$;

SELECT e.type, e.amount, e.balance_before, e.balance_after 
FROM tenant.current_account_entries e 
WHERE e.current_account_id = 'ef29c419-af3f-4efb-b840-ad13c33280f0'
ORDER BY e.date ASC, e.created_at ASC;
