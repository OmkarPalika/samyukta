#!/usr/bin/env tsx

import { getTypedCollections } from '../src/lib/db-utils';

async function fixAuthIssues() {
  try {
    console.log('🔧 Fixing authentication issues...');
    
    const collections = await getTypedCollections();
    
    // Ensure sessions collection exists and has proper indexes
    console.log('📋 Setting up sessions collection...');
    
    // Create index on session_token for faster lookups
    await collections.sessions.createIndex({ session_token: 1 }, { unique: true });
    
    // Create index on expires_at for automatic cleanup
    await collections.sessions.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });
    
    // Create index on user_id for user session management
    await collections.sessions.createIndex({ user_id: 1 });
    
    // Clean up expired sessions
    console.log('🧹 Cleaning up expired sessions...');
    const result = await collections.sessions.deleteMany({
      expires_at: { $lt: new Date() }
    });
    console.log(`Removed ${result.deletedCount} expired sessions`);
    
    console.log('✅ Authentication issues fixed successfully!');
    console.log('\n📱 Network Access Instructions:');
    console.log('1. Run: npm run dev:network');
    console.log('2. Access from mobile: http://192.168.29.118:3000');
    console.log('3. Make sure your mobile device is on the same WiFi network');
    
  } catch (error) {
    console.error('❌ Error fixing authentication issues:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  fixAuthIssues();
}

export { fixAuthIssues };