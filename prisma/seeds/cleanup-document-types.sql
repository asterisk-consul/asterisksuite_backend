-- Primero eliminar documentos que referencian document_types
DELETE FROM tenant.document_item_taxes WHERE document_item_id IN (SELECT id FROM tenant.document_items WHERE document_id IN (SELECT id FROM tenant.documents));
DELETE FROM tenant.document_items WHERE document_id IN (SELECT id FROM tenant.documents);
DELETE FROM tenant.document_taxes WHERE document_id IN (SELECT id FROM tenant.documents);
DELETE FROM tenant.documents;
DELETE FROM tenant.document_type_taxes;
DELETE FROM tenant.document_types;
