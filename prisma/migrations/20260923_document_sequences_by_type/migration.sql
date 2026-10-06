-- Separa las numeraciones compartidas para que cada tipo documental mantenga
-- su propio contador aunque utilice el mismo código de punto de venta.
ALTER TABLE tenant.document_sequences
  DROP CONSTRAINT IF EXISTS document_sequences_point_of_sale_prefix_key;

-- Versiones anteriores guardaban la asociación únicamente en
-- document_types.document_sequence_id. Se copia a la tabla relacional antes
-- de separar cualquier contador compartido.
INSERT INTO tenant.document_type_sequences (
  id, document_type_id, sequence_id, is_default, created_at
)
SELECT gen_random_uuid(), doc_type.id, doc_type.document_sequence_id, true, now()
FROM tenant.document_types doc_type
WHERE doc_type.document_sequence_id IS NOT NULL
  AND doc_type.deleted_at IS NULL
ON CONFLICT (document_type_id, sequence_id) DO NOTHING;

CREATE TEMP TABLE sequence_type_split AS
SELECT dts.sequence_id AS old_sequence_id, dts.document_type_id,
  row_number() OVER (PARTITION BY dts.sequence_id ORDER BY dts.created_at, dts.id) AS position,
  CASE WHEN row_number() OVER (PARTITION BY dts.sequence_id ORDER BY dts.created_at, dts.id) = 1
    THEN dts.sequence_id ELSE gen_random_uuid() END AS target_sequence_id
FROM tenant.document_type_sequences dts;

INSERT INTO tenant.document_sequences (
  id, name, automatic, range_start, range_end, point_of_sale, current_number,
  prefix, active, created_at, updated_at, created_by, updated_by
)
SELECT split.target_sequence_id, source.name || ' · ' || doc_type.code,
  source.automatic, source.range_start, source.range_end, source.point_of_sale,
  COALESCE((SELECT MAX(document.number) FROM tenant.documents document
    WHERE document.document_sequence_id = source.id
      AND document.document_type_id = split.document_type_id
      AND document.deleted_at IS NULL), COALESCE(source.range_start, 1) - 1),
  source.prefix, source.active, source.created_at, source.updated_at,
  source.created_by, source.updated_by
FROM sequence_type_split split
JOIN tenant.document_sequences source ON source.id = split.old_sequence_id
JOIN tenant.document_types doc_type ON doc_type.id = split.document_type_id
WHERE split.position > 1;

UPDATE tenant.documents document SET document_sequence_id = split.target_sequence_id
FROM sequence_type_split split
WHERE document.document_sequence_id = split.old_sequence_id
  AND document.document_type_id = split.document_type_id AND split.position > 1;

UPDATE tenant.fiscal_authorizations authorization SET document_sequence_id = split.target_sequence_id
FROM sequence_type_split split
WHERE authorization.document_sequence_id = split.old_sequence_id
  AND authorization.document_type_id = split.document_type_id AND split.position > 1;

UPDATE tenant.document_types doc_type SET document_sequence_id = split.target_sequence_id
FROM sequence_type_split split
WHERE doc_type.id = split.document_type_id
  AND doc_type.document_sequence_id = split.old_sequence_id AND split.position > 1;

DELETE FROM tenant.document_type_sequences relation USING sequence_type_split split
WHERE relation.sequence_id = split.old_sequence_id
  AND relation.document_type_id = split.document_type_id AND split.position > 1;

INSERT INTO tenant.document_type_sequences (id, document_type_id, sequence_id, is_default, created_at)
SELECT gen_random_uuid(), split.document_type_id, split.target_sequence_id, true, now()
FROM sequence_type_split split WHERE split.position > 1;

UPDATE tenant.document_sequences sequence
SET current_number = COALESCE((SELECT MAX(document.number)
  FROM tenant.documents document
  JOIN sequence_type_split split ON split.old_sequence_id = sequence.id
    AND split.document_type_id = document.document_type_id AND split.position = 1
  WHERE document.document_sequence_id = sequence.id AND document.deleted_at IS NULL
), COALESCE(sequence.range_start, 1) - 1)
WHERE EXISTS (SELECT 1 FROM sequence_type_split split
  WHERE split.old_sequence_id = sequence.id AND split.position = 1);

CREATE INDEX IF NOT EXISTS document_sequences_point_of_sale_prefix_idx
  ON tenant.document_sequences (point_of_sale, prefix);
