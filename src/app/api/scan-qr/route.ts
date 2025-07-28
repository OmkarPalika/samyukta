import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';

const funnyQuotes = [
  "🎉 You found a wild participant! They're probably looking for free food.",
  "🤖 Beep boop! This human is 99% caffeine and 1% code.",
  "🎭 Plot twist: This person is actually three cats in a trench coat.",
  "🚀 Warning: May spontaneously burst into tech jargon.",
  "🎪 Congratulations! You've unlocked a new friend (batteries not included).",
  "🎨 This participant's superpower is turning coffee into code.",
  "🎯 Achievement unlocked: Social interaction initiated!",
  "🎪 Fun fact: This person once debugged code in their sleep.",
  "🎭 Caution: Highly caffeinated and ready to network!",
  "🎨 This participant collects bugs... the coding kind, hopefully."
];

export async function POST(request: NextRequest) {
  try {
    const { participant_id, scan_type = 'public' } = await request.json();
    
    if (!participant_id) {
      return NextResponse.json({ error: 'Participant ID required' }, { status: 400 });
    }

    const collections = await getTypedCollections();
    
    // Find participant
    const participant = await collections.teamMembers.findOne({ participant_id });
    
    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    // Public scan - return funny quote
    if (scan_type === 'public') {
      const randomQuote = funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)];
      return NextResponse.json({
        type: 'public',
        message: randomQuote,
        participant_name: participant.full_name
      });
    }

    // Coordinator scan - return full details
    if (scan_type === 'coordinator') {
      // Get registration details
      const registration = await collections.registrations.findOne({ 
        team_id: participant.registration_id 
      });
      
      // Get all team members
      const teamMembers = await collections.teamMembers
        .find({ registration_id: participant.registration_id })
        .toArray();

      return NextResponse.json({
        type: 'coordinator',
        participant: {
          id: participant.participant_id,
          name: participant.full_name,
          email: participant.email,
          whatsapp: participant.whatsapp,
          college: participant.college,
          year: participant.year,
          department: participant.department,
          food_preference: participant.food_preference,
          accommodation: participant.accommodation,
          present: participant.present,
          is_club_lead: participant.is_club_lead,
          club_name: participant.club_name
        },
        team: {
          team_id: participant.registration_id,
          college: registration?.college,
          team_size: registration?.team_size,
          ticket_type: registration?.ticket_type,
          workshop_track: registration?.workshop_track,
          competition_track: registration?.competition_track,
          status: registration?.status,
          total_amount: registration?.total_amount,
          members: teamMembers.map(m => ({
            name: m.full_name,
            email: m.email,
            participant_id: m.participant_id,
            present: m.present
          }))
        }
      });
    }

    return NextResponse.json({ error: 'Invalid scan type' }, { status: 400 });

  } catch (error) {
    console.error('QR scan failed:', error);
    return NextResponse.json(
      { error: 'Failed to process QR scan' },
      { status: 500 }
    );
  }
}
