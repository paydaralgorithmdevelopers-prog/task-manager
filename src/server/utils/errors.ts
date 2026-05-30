/**
 * Custom application errors
 */

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request') {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Not Found') {
    super(404, message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict') {
    super(409, message);
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string = 'Validation Error',
    public errors?: Record<string, string>
  ) {
    super(422, message);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal Server Error') {
    super(500, message);
  }
}

/**
 * Format error response
 */
export function formatErrorResponse(error: AppError | Error) {
  if (error instanceof AppError) {
    return {
      error: {
        message: error.message,
        statusCode: error.statusCode,
        ...(error instanceof ValidationError && error.errors && { errors: error.errors }),
      },
    };
  }

  // For unknown errors, don't expose internal details in production
  return {
    error: {
      message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : error.message,
      statusCode: 500,
    },
  };
}
