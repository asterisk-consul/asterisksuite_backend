import Joi from 'joi';

export const validationSchema = Joi.object({
  SSH_HOST: Joi.string().required(),
  SSH_USER: Joi.string().required(),
  SSH_PORT: Joi.number().default(22),
  SSH_PRIVATE_KEY: Joi.string().optional(),
  SSH_PRIVATE_KEY_PATH: Joi.string().optional(),
  SSH_LOCAL_PORT: Joi.number().default(5433),

  DATABASE_URL: Joi.string().required(),

  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'dev', 'prod')
    .default('dev'),
  PORT: Joi.number().default(3008),
  CORS_ORIGINS: Joi.string().optional(),
}).or('SSH_PRIVATE_KEY', 'SSH_PRIVATE_KEY_PATH');
