CREATE TABLE IF NOT EXISTS public.company_whatsapp_report_settings (
  company_id UUID PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  selected_company_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  consolidated_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  consolidated_group_id VARCHAR(255),
  inventory_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  inventory_group_id VARCHAR(255),
  configured_by UUID,
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT company_whatsapp_report_settings_company_fk
    FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE,
  CONSTRAINT company_whatsapp_report_settings_company_ids_array
    CHECK (jsonb_typeof(selected_company_ids) = 'array')
);

CREATE INDEX IF NOT EXISTS company_whatsapp_report_settings_enabled_idx
  ON public.company_whatsapp_report_settings(enabled);

CREATE TABLE IF NOT EXISTS public.company_whatsapp_report_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  report_type VARCHAR(32) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  attempt_count INTEGER NOT NULL DEFAULT 0,
  message_id VARCHAR(255),
  last_error TEXT,
  started_at TIMESTAMP(6),
  sent_at TIMESTAMP(6),
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT company_whatsapp_report_runs_company_fk
    FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE,
  CONSTRAINT company_whatsapp_report_runs_type_check
    CHECK (report_type IN ('consolidated', 'inventory')),
  CONSTRAINT company_whatsapp_report_runs_status_check
    CHECK (status IN ('PENDING', 'PROCESSING', 'SENT', 'FAILED')),
  CONSTRAINT company_whatsapp_report_runs_attempt_count_check
    CHECK (attempt_count >= 0),
  CONSTRAINT company_whatsapp_report_runs_period_key
    UNIQUE (company_id, report_type, period_start, period_end)
);

CREATE INDEX IF NOT EXISTS company_whatsapp_report_runs_company_created_idx
  ON public.company_whatsapp_report_runs(company_id, created_at DESC);
