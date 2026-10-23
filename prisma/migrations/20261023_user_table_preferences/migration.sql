CREATE TABLE IF NOT EXISTS public.user_table_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  table_key VARCHAR(200) NOT NULL,
  column_order JSONB NOT NULL DEFAULT '[]'::jsonb,
  column_visibility JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP(6) NOT NULL DEFAULT now(),
  updated_at TIMESTAMP(6) NOT NULL DEFAULT now(),
  CONSTRAINT user_table_preferences_user_company_table_key
    UNIQUE (user_id, company_id, table_key)
);

CREATE INDEX IF NOT EXISTS user_table_preferences_company_user_idx
  ON public.user_table_preferences (company_id, user_id);
