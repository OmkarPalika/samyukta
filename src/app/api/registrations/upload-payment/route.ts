import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Upload the file to a storage service (S3, Firebase Storage, etc.)
    // 2. Get the URL of the uploaded file
    // 3. Return the URL to the client

    // For now, we'll mock this behavior
    const mockFileUrl = `https://storage.samyukta.com/payments/${Date.now()}-${file.name}`;

    return NextResponse.json({ file_url: mockFileUrl }, { status: 200 });
  } catch (error) {
    console.error('Error uploading payment screenshot:', error);
    return NextResponse.json(
      { error: 'Failed to upload payment screenshot' },
      { status: 500 }
    );
  }
}