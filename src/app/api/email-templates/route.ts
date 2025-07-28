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
    const isActive = searchParams.get('is_active');

    const db = await getDb();
    const { emailTemplates } = getCollections(db);

    const filter: Record<string, unknown> = {};
    if (type) filter.type = type;
    if (isActive !== null) filter.is_active = isActive === 'true';

    const templates = await emailTemplates
      .find(filter)
      .sort({ created_at: -1 })
      .toArray();

    const formattedTemplates = templates.map(template => ({
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
    }));

    return NextResponse.json({ templates: formattedTemplates });
  } catch (error) {
    console.error('Failed to fetch email templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email templates' },
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
    const { 
      name, 
      type, 
      subject, 
      html_content, 
      text_content, 
      variables = [], 
      is_active = true 
    } = body;

    if (!name || !type || !subject || !html_content) {
      return NextResponse.json(
        { error: 'Name, type, subject, and html_content are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const { emailTemplates } = getCollections(db);

    const newTemplate = {
      name,
      type,
      subject,
      html_content,
      text_content: text_content || '',
      variables,
      created_by: user.id,
      created_at: new Date(),
      updated_at: new Date(),
      is_active
    };

    const result = await emailTemplates.insertOne(newTemplate);

    return NextResponse.json({
      id: result.insertedId.toString(),
      ...newTemplate,
      created_at: newTemplate.created_at.toISOString(),
      updated_at: newTemplate.updated_at.toISOString()
    });
  } catch (error) {
    console.error('Failed to create email template:', error);
    return NextResponse.json(
      { error: 'Failed to create email template' },
      { status: 500 }
    );
  }
}
