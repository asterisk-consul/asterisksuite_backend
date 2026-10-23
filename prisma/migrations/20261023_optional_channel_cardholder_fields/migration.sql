ALTER TABLE tenant.credit_cards
  ALTER COLUMN last_four DROP NOT NULL,
  ALTER COLUMN holder_name DROP NOT NULL;

-- Los canales representan medios/plataformas de cobro, no tarjetas de clientes.
UPDATE tenant.credit_cards
SET last_four = NULL,
    holder_name = NULL
WHERE type = 'CUSTOMER';
