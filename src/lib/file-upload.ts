export async function uploadFile(file: File, endpoint: string = '/api/upload') {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  })
  
  if (!response.ok) {
    throw new Error('Upload failed')
  }
  
  return response.json()
}

export function validateFile(file: File, maxSize: number = 10 * 1024 * 1024) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type')
  }
  
  if (file.size > maxSize) {
    throw new Error('File too large')
  }
  
  return true
}