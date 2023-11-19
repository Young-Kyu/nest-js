import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HttpRequestLogger');
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { method, url, body } = context.getArgByIndex(0);
    // Do not print logs when requesting health check
    this.logger.log('Http method: ' + method + ', Url: ' + url);
    this.logger.log('Request Body: ' + JSON.stringify(body));
    return next.handle();
  }
}


@Injectable()
export class AfterInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HttpRequestLogger');
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { method, url } = context.getArgByIndex(0);
    return next.handle()
      .pipe(map(res => {
        this.logger.log('Http method: ' + method + ', Url: ' + url);
        this.logger.log('Response Body: ' + JSON.stringify(res));
        return {
          successOrNot: 'Y',
          data: res,
          status: 'SUCCESS'
        }
      }))
  }
}
