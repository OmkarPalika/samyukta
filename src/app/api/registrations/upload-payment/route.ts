import { NextRequest, NextResponse } from 'next/server'
import { uploadToGDrive } from '@/lib/gdrive'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const fileName = `payment_${Date.now()}_${file.name}`
    const fileUrl = await uploadToGDrive(buffer, fileName, file.type)
    
    return NextResponse.json({ file_url: fileUrl })
  } catch (error) {
    console.error('Payment upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}