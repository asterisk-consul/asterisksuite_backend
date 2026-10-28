-- Keep full customer names in generated document descriptions.
ALTER TABLE tenant.documents
  ALTER COLUMN descrip TYPE TEXT;
