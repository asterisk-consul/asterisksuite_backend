// src/config.ts
import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
    ssh: {
        host: process.env.SSH_HOST,
        port: Number(process.env.SSH_PORT) || 22,
        username: process.env.SSH_USER,
        privateKeyPath: process.env.SSH_PRIVATE_KEY_PATH,
        privateKeyInline: process.env.SSH_PRIVATE_KEY, // opcional
    },
    pg: {
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE,
        port: Number(process.env.PG_PORT) || 5433,
    },
    sshLocalPort: Number(process.env.SSH_LOCAL_PORT) || Number(process.env.PG_PORT) || 5433,
    jwt: {
        secret: process.env.JWT_SECRET || 'default-secret',
    },
};
