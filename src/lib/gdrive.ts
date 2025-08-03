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
  
  // Validate GAS URL format
  if (!gasUrl.includes('script.google.com') || !gasUrl.includes('/exec')) {
    throw new Error('Invalid GAS_UPLOAD_URL format. Expected Google Apps Script execution URL.');
  }

  // Convert file to base64
  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString('base64');

  console.log(`Uploading file: ${fileName} (${file.type}, ${(file.size / 1024 / 1024).toFixed(2)}MB) to ${uploadType}`);
  
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
  
  console.log(`GAS response status: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    throw new Error(`GAS upload failed: ${response.status}`);
  }

  const responseText = await response.text();
  
  // Clean the response text (remove BOM and extra whitespace)
  const cleanedResponse = responseText.replace(/^\uFEFF/, '').trim();
  
  // Check if response is HTML (error page)
  if (cleanedResponse.startsWith('<!DOCTYPE') || cleanedResponse.startsWith('<html')) {
    throw new Error('GAS service returned HTML instead of JSON. Check deployment configuration.');
  }
  
  // Check if response is empty
  if (!cleanedResponse) {
    throw new Error('GAS service returned empty response. Please try again.');
  }
  
  let result;
  try {
    result = JSON.parse(cleanedResponse);
  } catch (parseError) {
    console.error('Failed to parse GAS response:', {
      original: responseText,
      cleaned: cleanedResponse,
      error: parseError instanceof Error ? parseError.message : 'Unknown error'
    });
    throw new Error(`Invalid response from upload service. Parse error: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
  }
  
  if (!result.success) {
    throw new Error(`Upload failed: ${result.error}`);
  }

  return result.fileUrl;
}