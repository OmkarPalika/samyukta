import { NextRequest, NextResponse } from 'next/server';
import { MOCK_SOCIAL_ITEMS } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json(MOCK_SOCIAL_ITEMS);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const uploadedBy = formData.get('uploaded_by') as string;
    const caption = formData.get('caption') as string;
    const status = formData.get('status') as string || 'pending';

    if (!file || !uploadedBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newItem = {
      id: Date.now().toString(),
      uploaded_by: uploadedBy,
      caption: caption || '',
      file_url: `uploads/${file.name}`,
      status: status as 'pending' | 'approved' | 'rejected',
      created_at: new Date().toISOString()
    };

    MOCK_SOCIAL_ITEMS.push(newItem);
    return NextResponse.json({ data: newItem });
  } catch {
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, action } = await request.json();
    
    const itemIndex = MOCK_SOCIAL_ITEMS.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    if (action === 'approve') {
      MOCK_SOCIAL_ITEMS[itemIndex].status = 'approved';
    } else if (action === 'reject') {
      MOCK_SOCIAL_ITEMS[itemIndex].status = 'rejected';
    }

    return NextResponse.json({ data: MOCK_SOCIAL_ITEMS[itemIndex] });
  } catch {
    return NextResponse.json({ error: 'Failed to moderate item' }, { status: 500 });
  }
}