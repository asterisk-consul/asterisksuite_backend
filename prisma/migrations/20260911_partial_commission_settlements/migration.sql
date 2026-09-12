DROP INDEX IF EXISTS tenant.hr_vale_commission_details_document_id_key;

CREATE INDEX IF NOT EXISTS hr_vale_commission_details_document_id_idx
  ON tenant.hr_vale_commission_details(document_id);
