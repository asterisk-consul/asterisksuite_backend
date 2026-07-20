-- Eliminar la foreign key constraint de files.uploaded_by
-- porque users está en schema public y files en tenant (cross-schema no funciona)

ALTER TABLE tenant.files DROP CONSTRAINT IF EXISTS files_uploaded_by_fkey;
