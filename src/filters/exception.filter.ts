import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let response: string | Object;
    let status: number;
    let statusCode: string;

    this.logger.error('Http Method: ' + req.method + ' Url: ' + req.url, '');

    if (exception instanceof HttpException) {
      response = (exception as HttpException).getResponse();
      status = (exception as HttpException).getStatus();
      statusCode = response['message'].toString();
      console.log(response['message'].toString());
      this.logger.error('Http Exception: ' + JSON.stringify(response), '');
    } else {
      response = exception.message;
      status = 500;
      statusCode = exception.message;
      this.logger.error('Internal Server Error: ' + response, '');
    };

    res.status(status).json({
      successOrNot: 'N',
      statusCode: statusCode,
      data: {},
    });
  }
}
