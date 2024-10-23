import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BodyConverterInterceptor } from './interceptors/body-converter.interceptor';
import { ResponseNormalizationInterceptor } from './interceptors/response-normalization.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )

  app.useGlobalInterceptors(new BodyConverterInterceptor(), new ResponseNormalizationInterceptor())

  const config = new DocumentBuilder()
    .setTitle('Swagger Documentation Example')
    .setDescription('The Users API description')
    .setVersion('1.0')
    .addTag('users')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(3000);
}
bootstrap();
