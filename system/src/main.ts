import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app-module';
import { RestExceptionsFilter } from './filter/exception-filter';
import { ResponseBodyInterceptor } from './filter/response-body';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ maxAge:3600 });
  app.useGlobalInterceptors(new ResponseBodyInterceptor());
  app.useGlobalFilters(new RestExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(7000);
}
bootstrap();
