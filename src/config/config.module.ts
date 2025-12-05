import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './validation.schema';
import { loadSSHKey } from './ssh-key.loader';

// Cargar clave SSH antes de iniciar ConfigModule
loadSSHKey();

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema,
            validationOptions: {
                abortEarly: false,
                allowUnknown: true,
            },
        }),
    ],
})
export class AppConfigModule { }
