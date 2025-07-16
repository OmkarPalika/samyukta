import { NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';

export async function GET() {
  try {
    const collections = await getTypedCollections();
    
    // Get workshop stats
    const workshops = await collections.workshops.find({}).toArray();
    const cloudWorkshop = workshops.find(w => w.track === 'Cloud');
    const aiWorkshop = workshops.find(w => w.track === 'AI');
    
    // Get competition stats
    const competitions = await collections.competitions.find({}).toArray();
    const hackathon = competitions.find(c => c.category === 'Hackathon');
    const pitch = competitions.find(c => c.category === 'Pitch');
    
    // Get registration counts
    const totalRegistrations = await collections.registrations.countDocuments({});
    const cloudCount = await collections.teamMembers.countDocuments({ 
      'workshop_track': 'Cloud Computing (AWS)' 
    });
    const aiCount = await collections.teamMembers.countDocuments({ 
      'workshop_track': 'AI/ML (Google)' 
    });
    const hackathonCount = await collections.teamMembers.countDocuments({ 
      'competition_track': 'Hackathon' 
    });
    const pitchCount = await collections.teamMembers.countDocuments({ 
      'competition_track': 'Startup Pitch' 
    });
    
    const remainingCloud = Math.max(0, (cloudWorkshop?.capacity || 200) - cloudCount);
    const remainingAi = Math.max(0, (aiWorkshop?.capacity || 200) - aiCount);
    const remainingHackathon = Math.max(0, (hackathon?.slots_available || 250) - hackathonCount);
    const remainingPitch = Math.max(0, (pitch?.slots_available || 250) - pitchCount);
    const remainingTotal = remainingCloud + remainingAi + remainingHackathon + remainingPitch;
    
    const stats = {
      total_registrations: totalRegistrations || 400,
      cloud_workshop: cloudCount,
      ai_workshop: aiCount,
      hackathon_entries: hackathonCount,
      pitch_entries: pitchCount,
      max_cloud: cloudWorkshop?.capacity || 200,
      max_ai: aiWorkshop?.capacity || 200,
      max_hackathon: hackathon?.slots_available || 250,
      max_pitch: pitch?.slots_available || 250,
      remaining_cloud: remainingCloud,
      remaining_ai: remainingAi,
      remaining_hackathon: remainingHackathon,
      remaining_pitch: remainingPitch,
      remaining_total: remainingTotal,
      cloud_closed: cloudCount >= (cloudWorkshop?.capacity || 200),
      ai_closed: aiCount >= (aiWorkshop?.capacity || 200),
      hackathon_closed: hackathonCount >= (hackathon?.slots_available || 250),
      pitch_closed: pitchCount >= (pitch?.slots_available || 250),
      event_closed: remainingTotal === 0,
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching real-time stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}