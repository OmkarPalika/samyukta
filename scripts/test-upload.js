/**
 * Test script to diagnose upload issues
 * Run with: node scripts/test-upload.js
 */

import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function testGASConnection() {
  const gasUrl = process.env.GAS_UPLOAD_URL;
  
  console.log('🔍 Testing Google Apps Script Upload Configuration...\n');
  
  if (!gasUrl) {
    console.error('❌ GAS_UPLOAD_URL not found in environment variables');
    console.log('💡 Make sure you have GAS_UPLOAD_URL set in your .env file');
    return false;
  }
  
  console.log(`✅ GAS_UPLOAD_URL found: ${gasUrl}`);
  
  // Validate URL format
  if (!gasUrl.includes('script.google.com') || !gasUrl.includes('/exec')) {
    console.error('❌ Invalid GAS_UPLOAD_URL format');
    console.log('💡 Expected format: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec');
    return false;
  }
  
  console.log('✅ GAS_UPLOAD_URL format looks correct');
  
  // Test connection with a simple request
  try {
    console.log('\n🔄 Testing connection to GAS endpoint...');
    
    const testPayload = {
      fileData: 'dGVzdA==', // base64 for "test"
      fileName: 'test.txt',
      mimeType: 'text/plain',
      uploadType: 'test'
    };
    
    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });
    
    console.log(`📡 Response status: ${response.status} ${response.statusText}`);
    
    const responseText = await response.text();
    console.log(`📄 Response length: ${responseText.length} characters`);
    console.log(`📄 Response preview: ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`);
    
    // Check if response is HTML
    if (responseText.startsWith('<!DOCTYPE') || responseText.startsWith('<html')) {
      console.error('❌ GAS service returned HTML instead of JSON');
      console.log('💡 This usually means:');
      console.log('   - The GAS script is not deployed correctly');
      console.log('   - The script URL is incorrect');
      console.log('   - The script has permissions issues');
      return false;
    }
    
    // Try to parse as JSON
    try {
      const result = JSON.parse(responseText);
      console.log('✅ Response is valid JSON');
      console.log(`📊 Response data:`, result);
      return true;
    } catch (parseError) {
      console.error('❌ Response is not valid JSON');
      console.error('Parse error:', parseError.message);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Samyukta Upload Diagnostics\n');
  
  const success = await testGASConnection();
  
  console.log('\n' + '='.repeat(50));
  if (success) {
    console.log('✅ Upload service appears to be working correctly');
  } else {
    console.log('❌ Upload service has issues that need to be resolved');
    console.log('\n💡 Common solutions:');
    console.log('   1. Check your .env file has the correct GAS_UPLOAD_URL');
    console.log('   2. Verify the Google Apps Script is deployed and accessible');
    console.log('   3. Ensure the GAS script has proper permissions');
    console.log('   4. Check if the GAS script is returning proper JSON responses');
  }
  console.log('='.repeat(50));
}

main().catch(console.error);