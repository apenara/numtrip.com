/**
 * Custom error classes for the application
 */

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public fields?: Record<string, string>,
    details?: Record<string, any>
  ) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, details?: Record<string, any>) {
    super(`${resource} not found`, 404, 'NOT_FOUND', details);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access', details?: Record<string, any>) {
    super(message, 401, 'UNAUTHORIZED', details);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden', details?: Record<string, any>) {
    super(message, 403, 'FORBIDDEN', details);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 409, 'CONFLICT', details);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(
    message = 'Rate limit exceeded',
    public retryAfter?: number,
    details?: Record<string, any>
  ) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', details);
    this.name = 'RateLimitError';
  }
}

export class ExternalServiceError extends AppError {
  constructor(
    service: string,
    message: string,
    details?: Record<string, any>
  ) {
    super(`External service error (${service}): ${message}`, 502, 'EXTERNAL_SERVICE_ERROR', details);
    this.name = 'ExternalServiceError';
  }
}

/**
 * Error handler utility functions
 */
export const errorUtils = {
  /**
   * Checks if an error is an instance of AppError
   */
  isAppError: (error: unknown): error is AppError => {
    return error instanceof AppError;
  },

  /**
   * Extracts error message from various error types
   */
  getErrorMessage: (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unknown error occurred';
  },

  /**
   * Creates a safe error object for client consumption
   */
  toSafeError: (error: unknown) => {
    if (errorUtils.isAppError(error)) {
      return {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
        ...(error.details && { details: error.details }),
      };
    }

    // Don't expose internal error details in production
    const isProduction = process.env.NODE_ENV === 'production';
    
    return {
      code: 'INTERNAL_ERROR',
      message: isProduction ? 'An internal error occurred' : errorUtils.getErrorMessage(error),
      statusCode: 500,
    };
  },

  /**
   * Logs error with appropriate level based on error type
   */
  logError: (error: unknown, context?: Record<string, any>) => {
    const message = errorUtils.getErrorMessage(error);
    const logData = {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
      context,
      timestamp: new Date().toISOString(),
    };

    if (errorUtils.isAppError(error) && error.statusCode < 500) {
      // Client errors (4xx) - less severe
      console.warn('Client error:', message, logData);
    } else {
      // Server errors (5xx) or unknown errors - more severe
      console.error('Server error:', message, logData);
    }
  },
};