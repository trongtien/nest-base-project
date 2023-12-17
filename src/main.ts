import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/httpException.filter';
import { TransformInterceptors } from './shared/interceptor/transform.Interceptors';
import { validationTranForm } from './shared/pipes/validation-tranform.pipe';
import cookieParser from 'cookie-parser';

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        rawBody: true,
    });

    const hostDomain = AppModule.isDev ? `${AppModule.host}: ${AppModule.port}` : AppModule.host;
    const logger = new Logger(bootstrap.name);

    const swaggerOption = new DocumentBuilder()
        .setTitle('Service User')
        .setDescription('Api service user document')
        .setVersion('1.0.0')
        .setBasePath('/')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' }, 'authentication')
        .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerOption);

    SwaggerModule.setup('docs', app, swaggerDocument, {
        swaggerUrl: `${hostDomain}/docs/docs-json`,
        explorer: true,
        swaggerOptions: {
            docExpansion: 'list',
            filter: true,
            showRequestDuration: true,
        },
    });

    app.use(cookieParser());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptors());
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            exceptionFactory: (errors) => validationTranForm(errors),
        }),
    );

    app.use('/api/docs/swagger.json', (req, res) => {
        res.send(swaggerDocument);
    });

    try {
        if (module.hot) {
            module.hot.accept();
            module.hot.dispose(() => app.close());
        }
        await app.listen(AppModule.port);
    } catch (error) {
        logger.error(error);
    }
}

bootstrap();
