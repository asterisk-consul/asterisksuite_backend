ALTER TABLE tenant.files
  ADD COLUMN IF NOT EXISTS content_hash VARCHAR(64),
  ADD COLUMN IF NOT EXISTS purge_after TIMESTAMP(6);

CREATE UNIQUE INDEX IF NOT EXISTS files_content_hash_key
  ON tenant.files(content_hash);

CREATE INDEX IF NOT EXISTS idx_files_purge
  ON tenant.files(deleted_at, purge_after);
