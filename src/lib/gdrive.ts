export const UPLOAD_TYPES = {
  PAYMENT_SCREENSHOTS: 'payment-screenshots',
  COMPETITION_PAYMENTS: 'competition-payments',
  PITCH_DECKS: 'pitch-decks',
  SOCIAL_MEDIA: 'social-media',
  HELP_TICKETS: 'help-tickets',
  DEFAULT: 'default'
} as const;

export async function uploadToGoogleDrive(file: File, fileName: string, uploadType: string = UPLOAD_TYPES.DEFAULT) {
  const gasUrl = process.env.GAS_UPLOAD_URL;
  
  if (!gasUrl) {
    throw new Error('GAS_UPLOAD_URL not configured');
  }

  // Convert file to base64
  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString('base64');

  const response = await fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileData: base64,
      fileName: fileName,
      mimeType: file.type,
      uploadType: uploadType
    })
  });

  if (!response.ok) {
    throw new Error(`GAS upload failed: ${response.status}`);
  }

  const responseText = await response.text();
  
  // Check if response is HTML (error page)
  if (responseText.startsWith('<!DOCTYPE')) {
    throw new Error('GAS service returned HTML instead of JSON. Check deployment configuration.');
  }
  
  const result = JSON.parse(responseText);
  
  if (!result.success) {
    throw new Error(`Upload failed: ${result.error}`);
  }

  return result.fileUrl;
}