import { NextResponse } from 'next/server';

/**
 * Standard error response format for API endpoints
 */
export function errorResponse(message: string, status = 500, details?: unknown) {
  console.error(`API Error (${status}):`, message, details || '');
  
  const response: { error: string; details?: unknown } = { error: message };
  
  if (details) {
    response.details = details;
  }
  
  return NextResponse.json(response, { status });
}

/**
 * Standard success response format for API endpoints
 */
export function successResponse<T>(data: T, message?: string) {
  const response: { success: true; message?: string; data: T } = {
    success: true,
    data
  };
  
  if (message) {
    response.message = message;
  }
  
  return NextResponse.json(response);
}

/**
 * Wraps an API handler with standardized error handling
 */
export function withErrorHandling<T>(
  handler: () => Promise<T>,
  errorMessage = 'An error occurred'
) {
  return async () => {
    try {
      return await handler();
    } catch (error) {
      return errorResponse(
        errorMessage,
        500,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  };
}

/**
 * Validates required fields in a request body
 */
export function validateRequiredFields(
  data: Record<string, unknown>,
  requiredFields: string[]
) {
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    return {
      valid: false,
      error: errorResponse(
        `Missing required fields: ${missingFields.join(', ')}`,
        400
      )
    };
  }
  
  return { valid: true };
}

/**
 * Formats a MongoDB document for API response
 */
export function formatDocument<T extends { _id?: unknown }>(
  doc: T,
  options?: { excludeFields?: string[] }
) {
  if (!doc) return null;
  
  const formatted: Record<string, unknown> = { ...doc, id: doc._id?.toString() };
  delete formatted._id;
  
  if (options?.excludeFields) {
    options.excludeFields.forEach(field => {
      delete formatted[field];
    });
  }
  
  // Convert Date objects to ISO strings
  Object.entries(formatted).forEach(([key, value]) => {
    if (value instanceof Date) {
      formatted[key] = value.toISOString();
    }
  });
  
  return formatted;
}