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

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Convert buffer to File object for uploadToGoogleDrive
    const fileBlob = new File([buffer], file.name, { type: file.type })
    const fileUrl = await uploadToGoogleDrive(fileBlob, file.name, uploadType)
    
    return NextResponse.json({ 
      file_url: fileUrl,
      upload_type: uploadType
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}