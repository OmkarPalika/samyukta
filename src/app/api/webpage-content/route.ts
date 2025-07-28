import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCollections } from '@/lib/mongodb-schemas';
import { verifyAuth } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const db = await getDb();
    const { webpageContent } = getCollections(db);

    const filter: Record<string, unknown> = {};
    if (type) filter.type = type;
    if (status) filter.status = status;

    const contents = await webpageContent
      .find(filter)
      .sort({ created_at: -1 })
      .toArray();

    const formattedContents = contents.map(content => ({
      id: content._id?.toString(),
      type: content.type,
      title: content.title,
      content: content.content,
      status: content.status,
      created_by: content.created_by,
      created_at: content.created_at.toISOString(),
      updated_at: content.updated_at.toISOString()
    }));

    return NextResponse.json({ contents: formattedContents });
  } catch (error) {
    console.error('Failed to fetch webpage contents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch webpage contents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, title, content, status = 'draft' } = body;

    if (!type || !title || !content) {
      return NextResponse.json(
        { error: 'Type, title, and content are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const { webpageContent } = getCollections(db);

    const newContent = {
      type,
      title,
      content,
      status,
      created_by: user.id,
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await webpageContent.insertOne(newContent);

    return NextResponse.json({
      id: result.insertedId.toString(),
      ...newContent,
      created_at: newContent.created_at.toISOString(),
      updated_at: newContent.updated_at.toISOString()
    });
  } catch (error) {
    console.error('Failed to create webpage content:', error);
    return NextResponse.json(
      { error: 'Failed to create webpage content' },
      { status: 500 }
    );
  }
}
