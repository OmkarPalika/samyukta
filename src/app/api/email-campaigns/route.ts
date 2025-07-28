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
    const status = searchParams.get('status');

    const db = await getDb();
    const { emailCampaigns } = getCollections(db);

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const campaigns = await emailCampaigns
      .find(filter)
      .sort({ created_at: -1 })
      .toArray();

    const formattedCampaigns = campaigns.map(campaign => ({
      id: campaign._id?.toString(),
      name: campaign.name,
      template_id: campaign.template_id,
      recipients: campaign.recipients,
      status: campaign.status,
      scheduled_at: campaign.scheduled_at?.toISOString(),
      sent_at: campaign.sent_at?.toISOString(),
      stats: campaign.stats,
      created_by: campaign.created_by,
      created_at: campaign.created_at.toISOString(),
      updated_at: campaign.updated_at.toISOString()
    }));

    return NextResponse.json({ campaigns: formattedCampaigns });
  } catch (error) {
    console.error('Failed to fetch email campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email campaigns' },
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
      template_id, 
      recipients, 
      status = 'draft',
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

    const newCampaign = {
      name,
      template_id,
      recipients,
      status,
      scheduled_at: scheduled_at ? new Date(scheduled_at) : undefined,
      created_by: user.id,
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await emailCampaigns.insertOne(newCampaign);

    return NextResponse.json({
      id: result.insertedId.toString(),
      ...newCampaign,
      scheduled_at: newCampaign.scheduled_at?.toISOString(),
      created_at: newCampaign.created_at.toISOString(),
      updated_at: newCampaign.updated_at.toISOString()
    });
  } catch (error) {
    console.error('Failed to create email campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create email campaign' },
      { status: 500 }
    );
  }
}
