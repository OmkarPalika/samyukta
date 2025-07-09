import { NextRequest, NextResponse } from 'next/server';
import { MOCK_HELP_TICKETS } from '@/lib/mock-data';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: ticketId } = await params;
    const updateData = await request.json();
    
    const ticketIndex = MOCK_HELP_TICKETS.findIndex(ticket => ticket.id === ticketId);
    if (ticketIndex === -1) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    MOCK_HELP_TICKETS[ticketIndex] = { ...MOCK_HELP_TICKETS[ticketIndex], ...updateData, updated_at: new Date().toISOString() };

    return NextResponse.json(MOCK_HELP_TICKETS[ticketIndex]);
  } catch {
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}