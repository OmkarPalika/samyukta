import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCollections } from '@/lib/mongodb-schemas';
import { ObjectId } from 'mongodb';
import { verifyAuth } from '@/lib/server-auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      name, 
      template_id, 
      recipients, 
      status,
      scheduled_at 
    } = body;

    if (!name || !template_id || !recipients) {
      return NextResponse.json(
        { error: 'Name, template_id, and recipients are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const { emailCampaigns } = getCollections(db);

    const updateData = {
      name,
      template_id,
      recipients,
      status,
      scheduled_at: scheduled_at ? new Date(scheduled_at) : undefined,
      updated_at: new Date()
    };

    const { id } = await params;
    const result = await emailCampaigns.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update email campaign:', error);
    return NextResponse.json(
      { error: 'Failed to update email campaign' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const { emailCampaigns } = getCollections(db);

    const { id } = await params;
    const result = await emailCampaigns.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete email campaign:', error);
    return NextResponse.json(
      { error: 'Failed to delete email campaign' },
      { status: 500 }
    );
  }
}