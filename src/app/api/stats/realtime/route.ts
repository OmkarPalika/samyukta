import { NextResponse } from 'next/server';

export async function GET() {
  // For backward compatibility, redirect to the unified stats endpoint with realtime format
  return NextResponse.json({
    message: 'This endpoint is deprecated. Please use /api/stats?format=realtime',
    redirect: '/api/stats?format=realtime'
  });
}
