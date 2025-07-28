import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const uploadedBy = searchParams.get('uploaded_by');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const collections = await getTypedCollections();
    
    // Build filter
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (uploadedBy) filter.uploaded_by = uploadedBy;
    
    // Get total count
    const total = await collections.socialItems.countDocuments(filter);
    
    // Get social items with pagination
    const socialItems = await collections.socialItems
      .find(filter)
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
    
    const formattedItems = socialItems.map(item => ({
      id: item._id?.toString(),
      uploaded_by: item.uploaded_by,
      caption: item.caption,
      file_url: item.file_url,
      status: item.status,
      category: item.category,
      likes: item.likes || 0,
      comments: item.comments || 0,
      shares: item.shares || 0,
      tags: item.tags || [],
      created_at: item.created_at.toISOString(),
      updated_at: item.updated_at.toISOString()
    }));
    
    return NextResponse.json({
      items: formattedItems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Failed to fetch social items:', error);
    return NextResponse.json({ error: 'Failed to fetch social items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uploaded_by, caption, file_url, category, tags } = body;

    if (!uploaded_by || !file_url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const collections = await getTypedCollections();
    
    const result = await collections.socialItems.insertOne({
      uploaded_by,
      caption: caption || '',
      file_url,
      status: 'pending',
      category: category || 'general',
      likes: 0,
      comments: 0,
      shares: 0,
      tags: tags || [],
      created_at: new Date(),
      updated_at: new Date()
    });

    return NextResponse.json({ 
      success: true,
      item: {
        id: result.insertedId.toString(),
        ...body,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Failed to create social item:', error);
    return NextResponse.json({ error: 'Failed to upload item' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, action, ...updateData } = await request.json();
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 });
    }
    
    const collections = await getTypedCollections();
    
    let updateFields: Record<string, unknown> = { updated_at: new Date() };
    
    if (action === 'approve') {
      updateFields.status = 'approved';
    } else if (action === 'reject') {
      updateFields.status = 'rejected';
    } else {
      // General update
      updateFields = { ...updateData, updated_at: new Date() };
    }
    
    const result = await collections.socialItems.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    // Get updated item
    const updatedItem = await collections.socialItems.findOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ 
      success: true,
      item: {
        id: updatedItem?._id?.toString(),
        ...updatedItem
      }
    });
  } catch (error) {
    console.error('Failed to update social item:', error);
    return NextResponse.json({ error: 'Failed to moderate item' }, { status: 500 });
  }
}
