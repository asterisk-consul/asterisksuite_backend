CREATE TABLE "public"."mcp_oauth_clients" (
    "client_id" VARCHAR(255) NOT NULL,
    "client_info" JSONB NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    CONSTRAINT "mcp_oauth_clients_pkey" PRIMARY KEY ("client_id")
);

CREATE TABLE "public"."mcp_oauth_pending_authorizations" (
    "id" UUID NOT NULL,
    "client_id" VARCHAR(255) NOT NULL,
    "redirect_uri" TEXT NOT NULL,
    "requested_state" TEXT,
    "code_challenge" VARCHAR(255) NOT NULL,
    "requested_scopes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "resource" TEXT,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "consumed_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "mcp_oauth_pending_authorizations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."mcp_oauth_grants" (
    "id" UUID NOT NULL,
    "client_id" VARCHAR(255) NOT NULL,
    "user_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "scopes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "revoked_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    CONSTRAINT "mcp_oauth_grants_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."mcp_oauth_codes" (
    "code_hash" VARCHAR(64) NOT NULL,
    "grant_id" UUID NOT NULL,
    "client_id" VARCHAR(255) NOT NULL,
    "redirect_uri" TEXT NOT NULL,
    "code_challenge" VARCHAR(255) NOT NULL,
    "scopes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "resource" TEXT,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "consumed_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "mcp_oauth_codes_pkey" PRIMARY KEY ("code_hash")
);

CREATE TABLE "public"."mcp_oauth_refresh_tokens" (
    "id" UUID NOT NULL,
    "grant_id" UUID NOT NULL,
    "token_hash" VARCHAR(64) NOT NULL,
    "scopes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "expires_at" TIMESTAMP(6) NOT NULL,
    "revoked_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "mcp_oauth_refresh_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "mcp_oauth_refresh_tokens_token_hash_key"
    ON "public"."mcp_oauth_refresh_tokens"("token_hash");
CREATE INDEX "mcp_oauth_pending_expiry_idx"
    ON "public"."mcp_oauth_pending_authorizations"("expires_at");
CREATE INDEX "mcp_oauth_grants_user_company_idx"
    ON "public"."mcp_oauth_grants"("user_id", "company_id", "revoked_at");
CREATE INDEX "mcp_oauth_grants_client_idx"
    ON "public"."mcp_oauth_grants"("client_id");
CREATE INDEX "mcp_oauth_codes_expiry_idx"
    ON "public"."mcp_oauth_codes"("expires_at");
CREATE INDEX "mcp_oauth_codes_grant_idx"
    ON "public"."mcp_oauth_codes"("grant_id");
CREATE INDEX "mcp_oauth_refresh_grant_idx"
    ON "public"."mcp_oauth_refresh_tokens"("grant_id", "revoked_at");
CREATE INDEX "mcp_oauth_refresh_expiry_idx"
    ON "public"."mcp_oauth_refresh_tokens"("expires_at");

ALTER TABLE "public"."mcp_oauth_grants"
    ADD CONSTRAINT "mcp_oauth_grants_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."mcp_oauth_grants"
    ADD CONSTRAINT "mcp_oauth_grants_company_id_fkey"
    FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
