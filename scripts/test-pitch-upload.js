/**
 * Test script to simulate pitch deck upload
 * Run with: node scripts/test-pitch-upload.js
 */

import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function createTestFile() {
  // Create a small test PowerPoint file (simulated)
  const testContent = Buffer.from('PK' + 'A'.repeat(1000)); // Simulate a small binary file
  return new File([testContent], 'test-pitch.pptx', {
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  });
}

async function testPitchUpload() {
  console.log('🚀 Testing Pitch Deck Upload Process...\n');
  
  try {
    // Create test file
    const testFile = await createTestFile();
    console.log(`📄 Created test file: ${testFile.name} (${testFile.size} bytes, ${testFile.type})`);
    
    // Create FormData
    const formData = new FormData();
    formData.append('file', testFile);
    
    console.log('\n🔄 Uploading to /api/upload/pitch-deck...');
    
    // Test the actual API endpoint
    const response = await fetch('http://localhost:3000/api/upload/pitch-deck', {
      method: 'POST',
      body: formData
    });
    
    console.log(`📡 Response status: ${response.status} ${response.statusText}`);
    console.log(`📄 Response headers:`, Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log(`📄 Response length: ${responseText.length} characters`);
    console.log(`📄 Response text: ${responseText}`);
    
    // Test JSON parsing
    try {
      const result = JSON.parse(responseText);
      console.log('✅ Response parsed successfully as JSON');
      console.log('📊 Parsed result:', result);
      
      if (result.file_url) {
        console.log('✅ file_url found in response');
      } else {
        console.log('❌ file_url not found in response');
      }
      
      return true;
    } catch (parseError) {
      console.error('❌ JSON parsing failed:', parseError.message);
      console.error('Raw response that failed to parse:', responseText);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

async function main() {
  const success = await testPitchUpload();
  
  console.log('\n' + '='.repeat(50));
  if (success) {
    console.log('✅ Pitch upload test completed successfully');
  } else {
    console.log('❌ Pitch upload test failed');
    console.log('\n💡 This helps identify the exact cause of the "unexpected token" error');
  }
  console.log('='.repeat(50));
}

main().catch(console.error);