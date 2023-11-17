import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const option = {
    "origin": ["http://localhost:3000"],
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "credentials": true
  }
  app.enableCors(option);
  // app.useGlobalPipes()
  await app.listen(8080);
}
bootstrap();
