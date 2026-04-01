"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_js_1 = require("./app.module.js");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_js_1.AppModule);
    const logger = new common_1.Logger('Main');
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: [
            'http://localhost:3008',
            'http://localhost:3001',
            'http://localhost:5500',
            'http://127.0.0.1:5500',
            'null',
            'http://192.168.18.13:3008',
            'https://dev.astreisksuite.cloud',
            'http://dev.astreisksuite.cloud',
        ],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const config = app.get(config_1.ConfigService);
    const port = config.get('PORT') ?? 3008;
    await app.listen(port, '0.0.0.0');
    logger.log(`Server running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map