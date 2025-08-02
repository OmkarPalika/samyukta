export async function uploadFile(file: File, endpoint: string = '/api/upload', uploadType?: string, additionalData?: Record<string, string>) {
  const formData = new FormData()
  formData.append('file', file)
  if (uploadType) {
    formData.append('uploadType', uploadType)
  }
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value)
    })
  }
  
  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  })
  
  if (!response.ok) {
    throw new Error('Upload failed')
  }
  
  return response.json()
}

export function validateFile(file: File, maxSize: number = 10 * 1024 * 1024, uploadType?: string) {
  let allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  
  if (uploadType === 'pitch-decks') {
    allowedTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
    maxSize = 50 * 1024 * 1024 // 50MB for presentations
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type')
  }
  
  if (file.size > maxSize) {
    throw new Error('File too large')
  }
  
  return true
}