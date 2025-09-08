import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ErrorResponseDTO } from '../dtos/response/error-response.dto';

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {
  constructor() {
    super();
  }

  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    // getting the error status and message based on the exception
    const errorInfo: any = this.getExceptionInfo(exception);

    // interface for the response body
    const jsonBody: ErrorResponseDTO = {
      status: errorInfo.status,
      url: request.path,
      method: request.method,
      message: errorInfo.message,
      timestamp: new Date().toISOString(),
    };

    response.status(errorInfo.status).json(jsonBody);
  }

  /**
   * Gets the exception information
   * @param exception
   * @returns status and message of the exception
   */
  getExceptionInfo(exception: any): { status: number; message: string } {
    const status: number =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message: any =
      exception.getResponse?.().message ||
      exception.message ||
      'Something went wrong!';

    return { status, message };
  }
}
