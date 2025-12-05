// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SshModule } from './ssh/ssh.module';
import * as Joi from 'joi';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Cargar .env ANTES de todo
dotenv.config();

// Función para cargar la clave SSH desde archivo o variable de entorno
function loadSSHKey(): string {
  // Si existe SSH_PRIVATE_KEY directamente, usarla
  if (process.env.SSH_PRIVATE_KEY) {
    console.log('✅ Usando SSH_PRIVATE_KEY desde variable de entorno');
    return process.env.SSH_PRIVATE_KEY;
  }

  // Si existe SSH_PRIVATE_KEY_PATH, leer el archivo
  if (process.env.SSH_PRIVATE_KEY_PATH) {
    const keyPath = path.resolve(process.env.SSH_PRIVATE_KEY_PATH);

    console.log(`📂 Intentando leer clave SSH desde: ${keyPath}`);

    if (!fs.existsSync(keyPath)) {
      throw new Error(`❌ No se encuentra el archivo de clave SSH en: ${keyPath}`);
    }

    const privateKey = fs.readFileSync(keyPath, 'utf8');
    console.log('✅ Clave SSH cargada desde archivo correctamente');

    // Inyectar la clave en process.env para que ConfigModule la valide
    process.env.SSH_PRIVATE_KEY = privateKey;
    return privateKey;
  }

  throw new Error('❌ Debe proporcionar SSH_PRIVATE_KEY o SSH_PRIVATE_KEY_PATH en el archivo .env');
}

// Cargar la clave SSH antes de inicializar el módulo
try {
  loadSSHKey();
} catch (error) {
  console.error(error.message);
  console.error('📝 Variables de entorno disponibles:');
  console.error('   SSH_HOST:', process.env.SSH_HOST ? '✅' : '❌');
  console.error('   SSH_PORT:', process.env.SSH_PORT ? '✅' : '❌');
  console.error('   SSH_USER:', process.env.SSH_USER ? '✅' : '❌');
  console.error('   SSH_PRIVATE_KEY:', process.env.SSH_PRIVATE_KEY ? '✅' : '❌');
  console.error('   SSH_PRIVATE_KEY_PATH:', process.env.SSH_PRIVATE_KEY_PATH ? '✅' : '❌');
  throw error;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que ConfigService esté disponible globalmente
      envFilePath: '.env', // Ruta al archivo .env
      validationSchema: Joi.object({
        // Validación de variables de entorno SSH
        SSH_HOST: Joi.string().required(),
        SSH_PORT: Joi.number().default(22),
        SSH_USER: Joi.string().required(),
        SSH_PRIVATE_KEY: Joi.string().required(),
        SSH_PRIVATE_KEY_PATH: Joi.string().optional(),
        SSH_LOCAL_PORT: Joi.number().optional(),

        // Validación de variables de entorno de base de datos
        PG_USER: Joi.string().required(),
        PG_PASSWORD: Joi.string().required(),
        PG_DATABASE: Joi.string().required(),
        PG_PORT: Joi.number().default(5433),

        // JWT
        JWT_SECRET: Joi.string().default('default-secret-change-this'),

        // Variables opcionales
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
      }),
      validationOptions: {
        allowUnknown: true, // Permite variables no definidas en el schema
        abortEarly: false, // Valida todas las variables antes de fallar
      },
    }),
    SshModule,
    // ... otros módulos
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }