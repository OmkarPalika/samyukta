import { NextResponse } from 'next/server';
import { User } from '@/entities/User';

export async function GET() {
  try {
    const user = await User.me();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = {
      user,
      role: user.role
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}