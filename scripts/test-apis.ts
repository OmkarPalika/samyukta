#!/usr/bin/env tsx

import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const BASE_URL = 'http://localhost:3000';

async function checkServer() {
  try {
    const response = await fetch(BASE_URL);
    return response.ok;
  } catch {
    return false;
  }
}

async function testAPI(endpoint: string, method: string = 'GET', body?: any) {
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    console.log(`✅ ${method} ${endpoint}: ${response.status}`);
    if (!response.ok) {
      console.log(`   Error: ${data.error || 'Unknown error'}`);
    }
    return { success: response.ok, data };
  } catch (error) {
    console.log(`❌ ${method} ${endpoint}: Failed`);
    console.log(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { success: false, error };
  }
}

async function main() {
  console.log('🧪 Testing API endpoints...\n');

  // Check if server is running
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('❌ Server not running at http://localhost:3000');
    console.log('Please start the development server first:');
    console.log('   npm run dev');
    console.log('\nThen run the tests in another terminal.');
    return;
  }

  console.log('✅ Server is running\n');

  // Test basic endpoints
  await testAPI('/api/competitions');
  await testAPI('/api/registrations/stats');
  await testAPI('/api/social');
  await testAPI('/api/help-tickets');

  // Test with filters
  await testAPI('/api/competitions?status=open');
  await testAPI('/api/social?status=approved');
  await testAPI('/api/registrations?status=confirmed');

  // Test user endpoints (these might fail without auth)
  await testAPI('/api/users');
  await testAPI('/api/auth/me');

  console.log('\n🏁 API testing completed!');
  console.log('Note: Some endpoints may require authentication and will show 401 errors.');
}

main().catch(console.error);