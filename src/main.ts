import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ErrorHandlerFilter } from './filters/error-handler.filter';
import { ConfigService } from '@nestjs/config';
import { DatabaseErrorHandlerFilter } from './filters/database-error-handler.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const configService = app.get(ConfigService);
  const PORT = configService.get<string>('PORT')
  const HOST = configService.get<string>('HOST')
  const NODE_ENV = configService.get<string>('NODE_ENV')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )

  app.useGlobalFilters(new ErrorHandlerFilter(), new DatabaseErrorHandlerFilter());

  setupSwagger(app, NODE_ENV)

  await app.listen(PORT, () => console.log(`🚀 OK! App running on ${HOST}:${PORT} 🚀`));
}
bootstrap();


function setupSwagger(app: INestApplication, nodeEnv: string) {
  if (nodeEnv === 'development') {
    const config = new DocumentBuilder()
    .setTitle('Swagger Documentation Example')
    .setDescription('The Users API description')
    .setVersion('1.0')
    .addTag('users')
    .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
}
