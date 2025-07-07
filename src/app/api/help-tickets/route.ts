import { NextRequest, NextResponse } from 'next/server';

// Mock help tickets data storage
const helpTickets: Array<{
  id: string;
  title: string;
  description: string;
  submitted_by: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at?: string;
}> = [
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

export async function GET() {
  return NextResponse.json(helpTickets);
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
      status: 'open',
      priority,
      attachment_url: attachment ? `uploads/${attachment.name}` : null,
      created_at: new Date().toISOString()
    };

    helpTickets.push(newTicket);

    return NextResponse.json({ data: newTicket });
  } catch {
    return NextResponse.json({ error: 'Failed to create help ticket' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    
    const ticketIndex = helpTickets.findIndex(ticket => ticket.id === id);
    if (ticketIndex === -1) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    helpTickets[ticketIndex].status = status;
    helpTickets[ticketIndex].updated_at = new Date().toISOString();

    return NextResponse.json({ data: helpTickets[ticketIndex] });
  } catch {
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const ticketId = url.pathname.split('/').pop();
    const updateData = await request.json();
    
    const ticketIndex = helpTickets.findIndex(ticket => ticket.id === ticketId);
    if (ticketIndex === -1) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    helpTickets[ticketIndex] = { ...helpTickets[ticketIndex], ...updateData, updated_at: new Date().toISOString() };

    return NextResponse.json(helpTickets[ticketIndex]);
  } catch {
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}