import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let code: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      message = typeof errorResponse === 'string' 
        ? errorResponse 
        : (errorResponse as any).message || 'An error occurred';
      code = (errorResponse as any).code || 'HTTP_EXCEPTION';
    } else if (exception instanceof Error && 'statusCode' in exception) {
      // Custom app errors
      const appError = exception as AppError;
      status = appError.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      message = appError.message;
      code = appError.code || 'APP_ERROR';
    } else {
      // Unexpected errors
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      code = 'INTERNAL_ERROR';
      
      // Log unexpected errors
      this.logger.error(
        `Unexpected error: ${exception}`,
        exception instanceof Error ? exception.stack : undefined,
        `${request.method} ${request.url}`,
      );
    }

    const errorResponse = {
      error: {
        code,
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      },
    };

    this.logger.error(
      `HTTP ${status} Error: ${message}`,
      `${request.method} ${request.url}`,
    );

    response.status(status).json(errorResponse);
  }
}