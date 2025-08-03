import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const gasUrl = process.env.GAS_UPLOAD_URL;
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    gasUrlConfigured: !!gasUrl,
    gasUrlFormat: gasUrl ? {
      hasScriptGoogle: gasUrl.includes('script.google.com'),
      hasExec: gasUrl.includes('/exec'),
      url: gasUrl.substring(0, 50) + '...' // Partial URL for security
    } : null,
    nodeEnv: process.env.NODE_ENV
  };
  
  return NextResponse.json({
    status: 'Upload diagnostics',
    diagnostics,
    recommendations: gasUrl ? [] : [
      'Set GAS_UPLOAD_URL in your environment variables',
      'Ensure the URL follows the format: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
    ]
  });
}

export async function POST(request: NextRequest) {
  try {
    const gasUrl = process.env.GAS_UPLOAD_URL;
    
    if (!gasUrl) {
      return NextResponse.json({ 
        error: 'GAS_UPLOAD_URL not configured',
        diagnostics: { gasUrlConfigured: false }
      }, { status: 500 });
    }
    
    // Test with minimal payload
    const testPayload = {
      fileData: 'dGVzdA==', // base64 for "test"
      fileName: 'test.txt',
      mimeType: 'text/plain',
      uploadType: 'test'
    };
    
    console.log('Testing GAS connection...');
    
    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });
    
    const responseText = await response.text();
    
    console.log(`GAS response status: ${response.status}`);
    console.log(`GAS response text: ${responseText.substring(0, 200)}`);
    
    return NextResponse.json({
      status: 'Test completed',
      gasResponse: {
        status: response.status,
        statusText: response.statusText,
        responseLength: responseText.length,
        responsePreview: responseText.substring(0, 200),
        isHtml: responseText.startsWith('<!DOCTYPE') || responseText.startsWith('<html'),
        isJson: (() => {
          try {
            JSON.parse(responseText);
            return true;
          } catch {
            return false;
          }
        })()
      }
    });
    
  } catch (error) {
    console.error('Test upload error:', error);
    return NextResponse.json({
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}