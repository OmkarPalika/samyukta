import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCollections } from '@/lib/mongodb-schemas';
import { ObjectId } from 'mongodb';
import { verifyAuth } from '@/lib/server-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const { webpageContent } = getCollections(db);

    const { id } = await params;
    const content = await webpageContent.findOne({
      _id: new ObjectId(id)
    });

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: content._id?.toString(),
      type: content.type,
      title: content.title,
      content: content.content,
      status: content.status,
      created_by: content.created_by,
      created_at: content.created_at.toISOString(),
      updated_at: content.updated_at.toISOString()
    });
  } catch (error) {
    console.error('Failed to fetch webpage content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch webpage content' },
      { status: 500 }
    );
  }
}

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
    const { type, title, content, status } = body;

    if (!type || !title || !content) {
      return NextResponse.json(
        { error: 'Type, title, and content are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const { webpageContent } = getCollections(db);

    const updateData = {
      type,
      title,
      content,
      status,
      updated_at: new Date()
    };

    const { id } = await params;
    const result = await webpageContent.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update webpage content:', error);
    return NextResponse.json(
      { error: 'Failed to update webpage content' },
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
    const { webpageContent } = getCollections(db);

    const { id } = await params;
    const result = await webpageContent.deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete webpage content:', error);
    return NextResponse.json(
      { error: 'Failed to delete webpage content' },
      { status: 500 }
    );
  }
}