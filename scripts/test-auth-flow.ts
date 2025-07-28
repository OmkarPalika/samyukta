#!/usr/bin/env tsx

import { getTypedCollections } from '../src/lib/db-utils';

async function testAuthFlow() {
  try {
    console.log('🔐 Testing authentication flow...');
    
    const collections = await getTypedCollections();
    
    // Check if we have any admin users
    const adminUser = await collections.users.findOne({ role: 'admin' });
    if (adminUser) {
      console.log('✅ Admin user found:', adminUser.email);
    } else {
      console.log('⚠️  No admin user found');
    }
    
    // Check if we have any participants
    const participant = await collections.teamMembers.findOne({});
    if (participant) {
      console.log('✅ Participant found:', participant.email);
    } else {
      console.log('⚠️  No participants found');
    }
    
    // Check sessions collection
    const sessionCount = await collections.sessions.countDocuments();
    console.log(`📊 Active sessions: ${sessionCount}`);
    
    console.log('\n🌐 Network Configuration:');
    console.log('- Local URL: http://localhost:3000');
    console.log('- Network URL: http://192.168.29.118:3000');
    console.log('\n📱 To access from mobile:');
    console.log('1. Make sure your mobile is on the same WiFi network');
    console.log('2. Start the server with: npm run dev:network');
    console.log('3. Open http://192.168.29.118:3000 on your mobile browser');
    
  } catch (error) {
    console.error('❌ Error testing auth flow:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  testAuthFlow();
}

export { testAuthFlow };