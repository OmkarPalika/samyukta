import { NextRequest, NextResponse } from 'next/server';
import { MOCK_HELP_TICKETS } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json(MOCK_HELP_TICKETS);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const submittedBy = formData.get('submitted_by') as string;
    const priority = formData.get('priority') as string || 'medium';
    const attachment = formData.get('attachment') as File;

    if (!title || !description || !submittedBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newTicket = {
      id: Date.now().toString(),
      title,
      description,
      submitted_by: submittedBy,
      status: 'open' as const,
      priority: priority as 'low' | 'medium' | 'high' | 'urgent',
      attachment_url: attachment ? `uploads/${attachment.name}` : undefined,
      created_at: new Date().toISOString()
    };

    MOCK_HELP_TICKETS.push(newTicket);

    return NextResponse.json({ data: newTicket });
  } catch {
    return NextResponse.json({ error: 'Failed to create help ticket' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    
    const ticketIndex = MOCK_HELP_TICKETS.findIndex(ticket => ticket.id === id);
    if (ticketIndex === -1) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    MOCK_HELP_TICKETS[ticketIndex].status = status;
    MOCK_HELP_TICKETS[ticketIndex].updated_at = new Date().toISOString();

    return NextResponse.json({ data: MOCK_HELP_TICKETS[ticketIndex] });
  } catch {
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const ticketId = url.pathname.split('/').pop();
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