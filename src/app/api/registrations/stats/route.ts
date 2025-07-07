import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock data - replace with actual database queries
    const stats = {
      total_registrations: 365, // Current registrations (above 350 to show direct join)
      cloud_workshop: 185,      // Cloud workshop registrations
      ai_workshop: 180,         // AI workshop registrations
      hackathon_entries: 89,    // Hackathon competition entries
      pitch_entries: 67,        // Startup pitch entries
      
      // Limits
      max_total: 400,
      max_cloud: 200,
      max_ai: 200,
      
      // Calculated remaining slots
      remaining_total: 400 - 365,
      remaining_cloud: 200 - 185,
      remaining_ai: 200 - 180,
      
      // Direct join availability (after 350 registrations)
      direct_join_available: 365 >= 350,
      direct_join_hackathon_price: 250,
      direct_join_pitch_price: 200
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching registration stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registration stats' },
      { status: 500 }
    );
  }
}