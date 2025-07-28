import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getDbPromise, getCollections } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'coordinator' | 'participant';
  full_name?: string;
}

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Server-side authentication helper
 * TODO: Implement proper session/JWT token validation
 * Currently returns null to disable authentication checks
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    // TODO: Implement proper authentication logic
    // This could involve:
    // 1. Reading session cookies from request.cookies
    // 2. Validating JWT tokens from request.headers
    // 3. Checking database for user session
    
    // Placeholder to avoid unused parameter warning - will be used when auth is implemented
    void request.cookies;
    
    // For now, return null to disable authentication
    // This allows the admin dashboard to work without authentication
    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Check if user has admin role
 */
export async function isAdmin(request: NextRequest): Promise<boolean> {
  const user = await getAuthenticatedUser(request);
  return user?.role === 'admin';
}

/**
 * Require admin authentication for API routes
 * Currently disabled - returns true to allow access
 */
export async function requireAdmin(request: NextRequest): Promise<{ authorized: boolean; user?: AuthUser }> {
  // TODO: Enable authentication when auth system is properly implemented
  // const user = await getAuthenticatedUser(request);
  // if (!user || user.role !== 'admin') {
  //   return { authorized: false };
  // }
  // return { authorized: true, user };
  
  // Placeholder to avoid unused parameter warning - will be used when auth is implemented
  void request.url;
  
  // For now, allow all requests
  return { authorized: true };
}

export async function verifyAuth() {
  try {
    // Get token from cookies
    const cookieStore = cookies();
    const token = (await cookieStore).get('auth-token')?.value;

    if (!token) {
      // In development mode, return a mock admin user for testing
      if (process.env.NODE_ENV === 'development') {
        return {
          id: '6885f51385b463891d59d5ab',
          email: 'admin@samyukta.com',
          full_name: 'Admin User',
          role: 'admin' as const,
          phone: '9999999999',
          mobile_number: '9999999999',
          whatsapp: '9999999999',
          academic: {
            year: '4',
            department: 'CSE'
          },
          position: 'Administrator',
          committee: 'Core',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      return null;
    }

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

    // Get user from database
    const db = await getDbPromise();
    const { users } = getCollections(db);

    const user = await users.findOne({
      _id: new ObjectId(decoded.userId)
    });

    if (!user) {
      return null;
    }

    return {
      id: user._id?.toString(),
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      phone: user.phone,
      mobile_number: user.mobile_number,
      whatsapp: user.whatsapp,
      academic: user.academic,
      position: user.position,
      committee: user.committee,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
  } catch (error) {
    console.error('Auth verification failed:', error);
    return null;
  }
}