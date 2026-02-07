// Centralized error handling
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}

export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  RATE_LIMIT: 'RATE_LIMIT',
  DATABASE_ERROR: 'DATABASE_ERROR'
};

export function handleSupabaseError(error) {
  console.error('Supabase error details:', JSON.stringify(error, null, 2));

  // Map common Supabase errors
  if (error.code === 'PGRST116') {
    return new AppError('Resource not found', 404, ErrorCodes.NOT_FOUND);
  }
  
  if (error.code === '23505') {
    return new AppError('Duplicate entry', 409, 'DUPLICATE_ERROR');
  }

  if (error.code === '42501') {
    return new AppError('Insufficient permissions', 403, ErrorCodes.FORBIDDEN);
  }

  return new AppError(error.message || 'Database operation failed', 500, ErrorCodes.DATABASE_ERROR);
}

export function createErrorResponse(error) {
  const isDev = process.env.NODE_ENV === 'development';
  
  return {
    error: {
      message: error.message,
      code: error.code || ErrorCodes.INTERNAL_ERROR,
      ...(isDev && { stack: error.stack })
    }
  };
}

// Server action wrapper with error handling
export function withErrorHandling(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('Server action error:', error);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      // Handle Supabase errors
      if (error.code) {
        throw handleSupabaseError(error);
      }
      
      throw new AppError('An unexpected error occurred');
    }
  };
}