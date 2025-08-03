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
    
    // Google Apps Script has a 10MB payload limit
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB due to Google Apps Script limitations.` 
      }, { status: 413 });
    }

    // Add file size logging
    if (file.size > 5 * 1024 * 1024) {
      console.log(`Large file upload (${(file.size / (1024 * 1024)).toFixed(1)}MB): ${file.name}`);
    }

    // Upload to Google Drive with timeout handling
    try {
      const fileUrl = await uploadToGoogleDrive(file, file.name, UPLOAD_TYPES.PITCH_DECKS);
      
      return NextResponse.json({ 
        success: true,
        file_url: fileUrl,
        file_name: file.name,
        file_size: file.size
      });
    } catch (uploadError) {
      console.error('Google Drive upload error:', uploadError);
      
      // Provide specific error messages for common mobile issues
      if (uploadError instanceof Error) {
        if (uploadError.message.includes('timeout') || uploadError.message.includes('TIMEOUT')) {
          return NextResponse.json({ 
            error: 'Upload timed out. This often happens on mobile networks. Please try again with a smaller file or better internet connection.' 
          }, { status: 408 });
        }
        if (uploadError.message.includes('<!DOCTYPE') || uploadError.message.includes('GAS service returned HTML')) {
          return NextResponse.json({ 
            error: 'Upload service temporarily unavailable. Please wait a moment and try again.' 
          }, { status: 503 });
        }
        if (uploadError.message.includes('Invalid response') || uploadError.message.includes('Failed to parse')) {
          return NextResponse.json({ 
            error: 'Upload service returned invalid response. Please try again.' 
          }, { status: 503 });
        }
        if (uploadError.message.includes('network') || uploadError.message.includes('connection')) {
          return NextResponse.json({ 
            error: 'Network error. Please check your internet connection and try again.' 
          }, { status: 503 });
        }
        if (uploadError.message.includes('GAS_UPLOAD_URL not configured')) {
          return NextResponse.json({ 
            error: 'Upload service not configured. Please contact support.' 
          }, { status: 500 });
        }
      }
      
      throw uploadError;
    }
    
  } catch (error) {
    console.error('Pitch deck upload error:', error);
    
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Upload failed. Please try again.' 
    }, { status: 500 });
  }
}
