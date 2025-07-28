import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCollections } from '@/lib/mongodb-schemas';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status') || 'published';

    const db = await getDb();
    const { webpageContent } = getCollections(db);

    const filter: Record<string, unknown> = { status };
    if (type) filter.type = type;

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
      created_at: content.created_at.toISOString(),
      updated_at: content.updated_at.toISOString()
    }));

    return NextResponse.json({ contents: formattedContents });
  } catch (error) {
    console.error('Failed to fetch public webpage contents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch webpage contents' },
      { status: 500 }
    );
  }
}