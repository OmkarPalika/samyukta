import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ticketId } = await params;
    
    if (!ObjectId.isValid(ticketId)) {
      return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 400 });
    }
    
    const collections = await getTypedCollections();
    
    const ticket = await collections.helpTickets.findOne({ _id: new ObjectId(ticketId) });
    
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      id: ticket._id.toString(),
      submitted_by: ticket.submitted_by,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      assigned_to: ticket.assigned_to,
      response: ticket.response,
      created_at: ticket.created_at.toISOString(),
      updated_at: ticket.updated_at.toISOString()
    });
  } catch (error) {
    console.error('Failed to fetch ticket:', error);
    return NextResponse.json({ error: 'Failed to fetch ticket' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ticketId } = await params;
    const updateData = await request.json();
    
    if (!ObjectId.isValid(ticketId)) {
      return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 400 });
    }
    
    const collections = await getTypedCollections();
    
    // Check if ticket exists
    const ticket = await collections.helpTickets.findOne({ _id: new ObjectId(ticketId) });
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }
    
    // Update ticket
    const result = await collections.helpTickets.updateOne(
      { _id: new ObjectId(ticketId) },
      { 
        $set: { 
          ...updateData,
          updated_at: new Date() 
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }
    
    // Get updated ticket
    const updatedTicket = await collections.helpTickets.findOne({ _id: new ObjectId(ticketId) });
    
    return NextResponse.json({
      id: updatedTicket?._id.toString(),
      submitted_by: updatedTicket?.submitted_by,
      title: updatedTicket?.title,
      description: updatedTicket?.description,
      status: updatedTicket?.status,
      priority: updatedTicket?.priority,
      assigned_to: updatedTicket?.assigned_to,
      response: updatedTicket?.response,
      created_at: updatedTicket?.created_at.toISOString(),
      updated_at: updatedTicket?.updated_at.toISOString()
    });
  } catch (error) {
    console.error('Failed to update ticket:', error);
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ticketId } = await params;
    
    if (!ObjectId.isValid(ticketId)) {
      return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 400 });
    }
    
    const collections = await getTypedCollections();
    
    const result = await collections.helpTickets.deleteOne({ _id: new ObjectId(ticketId) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Failed to delete ticket:', error);
    return NextResponse.json({ error: 'Failed to delete ticket' }, { status: 500 });
  }
}