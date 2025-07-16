import { NextRequest, NextResponse } from 'next/server';
import { uploadToGoogleDrive, UPLOAD_TYPES } from '@/lib/gdrive';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate pitch deck file
    const allowedTypes = [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only PDF and PowerPoint files are allowed.' 
      }, { status: 400 });
    }
    
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 50MB.' 
      }, { status: 400 });
    }

    // Upload to Google Drive
    const fileUrl = await uploadToGoogleDrive(file, file.name, UPLOAD_TYPES.PITCH_DECKS);
    
    return NextResponse.json({ 
      success: true,
      file_url: fileUrl,
      file_name: file.name,
      file_size: file.size
    });
  } catch (error) {
    console.error('Pitch deck upload error:', error);
    
    // Handle specific GAS errors
    if (error instanceof Error && error.message.includes('<!DOCTYPE')) {
      return NextResponse.json({ 
        error: 'Upload service temporarily unavailable. Please try again later.' 
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Upload failed' 
    }, { status: 500 });
  }
}