import { NextRequest, NextResponse } from 'next/server';

// Mock help tickets data storage (shared with main route)
let helpTickets: any[] = [
  {
    id: '1',
    title: 'Login Issue',
    description: 'Cannot access my dashboard after registration',
    submitted_by: 'user123',
    status: 'open',
    priority: 'medium',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Payment Verification',
    description: 'Payment made but status not updated',
    submitted_by: 'user456',
    status: 'in_progress',
    priority: 'high',
    created_at: new Date().toISOString()
  }
];

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ticketId = params.id;
    const updateData = await request.json();
    
    const ticketIndex = helpTickets.findIndex(ticket => ticket.id === ticketId);
    if (ticketIndex === -1) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    helpTickets[ticketIndex] = { ...helpTickets[ticketIndex], ...updateData, updated_at: new Date().toISOString() };

    return NextResponse.json(helpTickets[ticketIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}