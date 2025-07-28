import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { ticketId, response, assignedTo, status = 'in_progress' } = await request.json();
    const collections = await getTypedCollections();
    
    await collections.helpTickets.updateOne(
      { _id: new ObjectId(ticketId) },
      { 
        $set: { 
          assigned_to: assignedTo,
          status,
          response,
          updated_at: new Date() 
        } 
      }
    );
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to respond to ticket' }, { status: 500 });
  }
}
