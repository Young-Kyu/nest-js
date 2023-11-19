import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { LoggingInterceptor, AfterInterceptor } from './interceptors/LogginInterceptor';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { HttpExceptionFilter } from './filters/exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const serverConfig = config.get('server');
  const hostConfig = config.get('cros');
  const option = {
    "origin": [hostConfig.host],
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "credentials": true
  }
  app.enableCors(option);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new AfterInterceptor(),
  );

  await app.listen(serverConfig.port);
}
bootstrap();

/* 
  미들웨어 호출 순서
  1. middleware 
  2. guard
  3. interceptor(before)
  4. pipe
  5. controller
  6. service
  7. controller
  8. interceptor(after)
  9. filter (if applicable)
  10. client
*/