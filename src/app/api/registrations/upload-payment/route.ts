import { NextRequest, NextResponse } from 'next/server';
import { uploadToGoogleDrive, UPLOAD_TYPES } from '@/lib/gdrive';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `payment_${timestamp}_${file.name}`;
    
    // Upload to Google Drive with payment screenshots type
    const fileUrl = await uploadToGoogleDrive(file, fileName, UPLOAD_TYPES.PAYMENT_SCREENSHOTS);
    
    return NextResponse.json({ 
      success: true,
      file_url: fileUrl,
      message: 'Payment screenshot uploaded successfully'
    });
    
  } catch (error) {
    console.error('Payment upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload payment screenshot' },
      { status: 500 }
    );
  }
}