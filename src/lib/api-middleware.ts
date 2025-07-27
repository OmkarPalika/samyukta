/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sanitizeUserInput, sanitizeDbQuery } from './sanitization';
// import { rateLimit } from './rate-limit';

// Types
interface ApiHandler {
  GET?: (req: NextRequest, context: ApiContext) => Promise<NextResponse>;
  POST?: (req: NextRequest, context: ApiContext) => Promise<NextResponse>;
  PUT?: (req: NextRequest, context: ApiContext) => Promise<NextResponse>;
  DELETE?: (req: NextRequest, context: ApiContext) => Promise<NextResponse>;
  PATCH?: (req: NextRequest, context: ApiContext) => Promise<NextResponse>;
}

interface ApiContext {
  params: Record<string, string>;
  user?: unknown;
  body?: unknown;
  query?: Record<string, string>;
}

interface MiddlewareOptions {
  auth?: boolean;
  roles?: string[];
  rateLimit?: {
    requests: number;
    window: number; // in seconds
  };
  validation?: {
    body?: z.ZodSchema;
    query?: z.ZodSchema;
    params?: z.ZodSchema;
  };
  sanitize?: boolean;
  cors?: boolean;
}

// Error classes
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, public errors: any[] = []) {
    super(400, message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = 'Authentication required') {
    super(401, message, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApiError {
  constructor(message = 'Insufficient permissions') {
    super(403, message, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class RateLimitError extends ApiError {
  constructor(message = 'Rate limit exceeded') {
    super(429, message, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
  }
}

// Authentication middleware
async function authenticateUser(req: NextRequest): Promise<unknown> {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '') ||
                  req.cookies.get('auth-token')?.value;

    if (!token) {
      throw new AuthenticationError();
    }

    // Verify JWT token (implement your JWT verification logic)
    const user = await verifyJwtToken(token);
    return user;
  } catch {
    throw new AuthenticationError('Invalid or expired token');
  }
}

// Authorization middleware
function authorizeUser(user: unknown, requiredRoles: string[]): void {
  if (!user) {
    throw new AuthenticationError();
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes((user as { role: string }).role)) {
    throw new AuthorizationError();
  }
}

// Validation middleware
function validateRequest(
  data: unknown,
  schema: z.ZodSchema,
  type: 'body' | 'query' | 'params'
): unknown {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));
      throw new ValidationError(`Invalid ${type}`, errors);
    }
    throw new ValidationError(`Validation failed for ${type}`);
  }
}

// CORS middleware
function setCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

// Security headers middleware
function setSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  return response;
}

// Main API wrapper
export function createApiHandler(
  handlers: ApiHandler,
  options: MiddlewareOptions = {}
) {
  return async function handler(
    req: NextRequest,
    { params }: { params: Record<string, string> }
  ): Promise<NextResponse> {
    try {
      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        const response = new NextResponse(null, { status: 200 });
        return options.cors ? setCorsHeaders(response) : response;
      }

      // Get the appropriate handler
      const methodHandler = handlers[req.method as keyof ApiHandler];
      if (!methodHandler) {
        return NextResponse.json(
          { error: 'Method not allowed' },
          { status: 405 }
        );
      }

      // Rate limiting (disabled - requires rate-limit module)
      // if (options.rateLimit) {
      //   const clientIp = req.headers.get('x-forwarded-for') || 
      //                   req.headers.get('x-real-ip') || 
      //                   'unknown';
      //   
      //   const rateLimitKey = `${req.method}:${req.nextUrl.pathname}:${clientIp}`;
      //   
      //   const isAllowed = await rateLimit(
      //     rateLimitKey,
      //     options.rateLimit.requests,
      //     options.rateLimit.window
      //   );
      //   
      //   if (!isAllowed) {
      //     throw new RateLimitError();
      //   }
      // }

      // Authentication
      let user;
      if (options.auth) {
        user = await authenticateUser(req);
        authorizeUser(user, options.roles || []);
      }

      // Parse request body
      let body;
      if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        try {
          const text = await req.text();
          body = text ? JSON.parse(text) : {};
        } catch (error) {
          throw new ValidationError('Invalid JSON in request body');
        }
      }

      // Parse query parameters
      const query: Record<string, string> = {};
      req.nextUrl.searchParams.forEach((value, key) => {
        query[key] = value;
      });

      // Sanitization
      if (options.sanitize) {
        if (body) {
          body = sanitizeUserInput(body);
        }
        if (Object.keys(query).length > 0) {
          Object.keys(query).forEach(key => {
            query[key] = sanitizeDbQuery({ [key]: query[key] })[key];
          });
        }
      }

      // Validation
      if (options.validation) {
        if (options.validation.body && body) {
          body = validateRequest(body, options.validation.body, 'body');
        }
        if (options.validation.query && Object.keys(query).length > 0) {
          validateRequest(query, options.validation.query, 'query');
        }
        if (options.validation.params && params) {
          validateRequest(params, options.validation.params, 'params');
        }
      }

      // Create context
      const context: ApiContext = {
        params,
        user,
        body,
        query,
      };

      // Execute handler
      const response = await methodHandler(req, context);

      // Add security headers
      const secureResponse = setSecurityHeaders(response);

      // Add CORS headers if enabled
      return options.cors ? setCorsHeaders(secureResponse) : secureResponse;

    } catch (error) {
      console.error('API Error:', error);

      // Handle known errors
      if (error instanceof ApiError) {
        const response = NextResponse.json(
          {
            error: error.message,
            code: error.code,
            ...(error instanceof ValidationError && { errors: error.errors }),
          },
          { status: error.statusCode }
        );

        const secureResponse = setSecurityHeaders(response);
        return options.cors ? setCorsHeaders(secureResponse) : secureResponse;
      }

      // Handle unknown errors
      const response = NextResponse.json(
        {
          error: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : error instanceof Error ? error.message : 'Unknown error',
          code: 'INTERNAL_ERROR',
        },
        { status: 500 }
      );

      const secureResponse = setSecurityHeaders(response);
      return options.cors ? setCorsHeaders(secureResponse) : secureResponse;
    }
  };
}

// Utility functions
async function verifyJwtToken(_token: string): Promise<unknown> {
  // Implement JWT verification logic here
  // This is a placeholder - replace with actual JWT verification
  try {
    // Example using a JWT library
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // return decoded;
    
    // For now, return a mock user
    return { id: '1', email: 'user@example.com', role: 'user' };
  } catch {
    throw new AuthenticationError('Invalid token');
  }
}

// Response helpers
export function successResponse(data: unknown, status = 200): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  }, { status });
}

export function errorResponse(
  message: string,
  status = 400,
  code?: string,
  errors?: unknown[]
): NextResponse {
  return NextResponse.json({
    success: false,
    error: message,
    code,
    errors,
    timestamp: new Date().toISOString(),
  }, { status });
}

export function paginatedResponse(
  data: unknown[],
  total: number,
  page: number,
  limit: number
): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
    timestamp: new Date().toISOString(),
  });
}

// Middleware presets
export const authMiddleware = (roles: string[] = []) => ({
  auth: true,
  roles,
  sanitize: true,
  cors: true,
});

export const publicMiddleware = () => ({
  auth: false,
  sanitize: true,
  cors: true,
  rateLimit: {
    requests: 100,
    window: 60, // 1 minute
  },
});

export const adminMiddleware = () => ({
  auth: true,
  roles: ['admin'],
  sanitize: true,
  cors: true,
  rateLimit: {
    requests: 200,
    window: 60,
  },
});

// Export types
export type { ApiHandler, ApiContext, MiddlewareOptions };