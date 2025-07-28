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
    const { emailTemplates } = getCollections(db);

    const { id } = await params;
    const template = await emailTemplates.findOne({
      _id: new ObjectId(id)
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: template._id?.toString(),
      name: template.name,
      type: template.type,
      subject: template.subject,
      html_content: template.html_content,
      text_content: template.text_content,
      variables: template.variables,
      created_by: template.created_by,
      created_at: template.created_at.toISOString(),
      updated_at: template.updated_at.toISOString(),
      is_active: template.is_active
    });
  } catch (error) {
    console.error('Failed to fetch email template:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email template' },
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
    const { 
      name, 
      type, 
      subject, 
      html_content, 
      text_content, 
      variables, 
      is_active 
    } = body;

    if (!name || !type || !subject || !html_content) {
      return NextResponse.json(
        { error: 'Name, type, subject, and html_content are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const { emailTemplates } = getCollections(db);

    const updateData = {
      name,
      type,
      subject,
      html_content,
      text_content: text_content || '',
      variables: variables || [],
      is_active: is_active !== undefined ? is_active : true,
      updated_at: new Date()
    };

    const { id } = await params;
    const result = await emailTemplates.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update email template:', error);
    return NextResponse.json(
      { error: 'Failed to update email template' },
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
    const { emailTemplates } = getCollections(db);

    const { id } = await params;
    const result = await emailTemplates.deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete email template:', error);
    return NextResponse.json(
      { error: 'Failed to delete email template' },
      { status: 500 }
    );
  }
}