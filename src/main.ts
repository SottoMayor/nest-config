import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BodyConverterInterceptor } from './interceptors/body-converter.interceptor';
import { ResponseNormalizationInterceptor } from './interceptors/response-normalization.interceptor';
import { ErrorHandlerFilter } from './filters/error-handler.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )

  app.useGlobalInterceptors(new BodyConverterInterceptor(), new ResponseNormalizationInterceptor());

  app.useGlobalFilters(new ErrorHandlerFilter());

  setupSwagger(app)

  await app.listen(3000);
}
bootstrap();


function setupSwagger(app: INestApplication) {
  if (process.env.NODE_ENV === 'development') {
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
