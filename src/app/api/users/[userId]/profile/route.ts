import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth-token');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const profileData = await request.json();
    const { userId } = await params;

    // Mock profile update - replace with actual database logic
    const updatedProfile = {
      id: userId,
      ...profileData,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      profile: updatedProfile 
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}