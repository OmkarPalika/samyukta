import { NextResponse } from 'next/server';

export async function GET() {
  // Redirect to the unified stats endpoint with registration format
  return NextResponse.redirect(new URL('/api/stats?format=registration', 'http://localhost:3000'));
}
