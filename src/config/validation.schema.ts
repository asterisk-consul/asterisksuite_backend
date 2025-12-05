import * as Joi from 'joi';

export const validationSchema = Joi.object({
    SSH_HOST: Joi.string().required(),
    SSH_USER: Joi.string().required(),
    SSH_PORT: Joi.number().default(22),
    SSH_PRIVATE_KEY: Joi.string().required(),
    SSH_PRIVATE_KEY_PATH: Joi.string().optional(),
    SSH_LOCAL_PORT: Joi.number().optional(),

    PG_USER: Joi.string().required(),
    PG_PASSWORD: Joi.string().required(),
    PG_DATABASE: Joi.string().required(),
    PG_PORT: Joi.number().default(5433),

    JWT_SECRET: Joi.string().default('default-secret-change-this'),

    NODE_ENV: Joi.string().valid('dev', 'prod', 'test').default('dev'),
    PORT: Joi.number().default(3000),
});
