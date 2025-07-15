import { NextRequest, NextResponse } from 'next/server'
import { uploadToGoogleDrive, UPLOAD_TYPES } from '@/lib/gdrive'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const uploadType = formData.get('uploadType') as string || UPLOAD_TYPES.DEFAULT
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file for pitch decks
    if (uploadType === UPLOAD_TYPES.PITCH_DECKS) {
      const allowedTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: 'Invalid file type for pitch deck. Only PDF and PowerPoint files are allowed.' }, { status: 400 })
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        return NextResponse.json({ error: 'File too large. Maximum size is 50MB.' }, { status: 400 })
      }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Convert buffer to File object for uploadToGoogleDrive
    const fileBlob = new File([buffer], file.name, { type: file.type })
    const fileUrl = await uploadToGoogleDrive(fileBlob, file.name, uploadType)
    
    return NextResponse.json({ 
      file_url: fileUrl,
      upload_type: uploadType,
      file_name: file.name,
      file_size: file.size
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Upload failed' 
    }, { status: 500 })
  }
}
