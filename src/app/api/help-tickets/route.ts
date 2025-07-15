import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';

export async function POST(request: NextRequest) {
  try {
    const { participantId, title, description, priority = 'medium' } = await request.json();
    const collections = await getTypedCollections();
    
    // Verify participant exists
    const participant = await collections.teamMembers.findOne({ participant_id: participantId });
    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }
    
    // Create help ticket
    const ticket = await collections.helpTickets.insertOne({
      submitted_by: participantId,
      title,
      description,
      status: 'open',
      priority,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    return NextResponse.json({ 
      success: true, 
      ticketId: ticket.insertedId.toString() 
    });
  } catch {
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const participantId = searchParams.get('participantId');
    const collections = await getTypedCollections();
    
    const filter = participantId ? { submitted_by: participantId } : {};
    const tickets = await collections.helpTickets.find(filter)
      .sort({ created_at: -1 })
      .toArray();
    
    return NextResponse.json({ tickets });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}