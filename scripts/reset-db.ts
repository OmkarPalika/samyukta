#!/usr/bin/env tsx

import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

// Load environment variables
config({ path: '.env.local' });

async function resetDB() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is required');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    console.log('🔄 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('samyukta');
    
    // Collections that should be reset (user-generated data)
    const collectionsToReset = [
      'registrations',
      'team_members', 
      'competition_registrations',
      'help_tickets',
      'social_items',
      'games',
      'pitch_ratings',
      'sessions'
    ];
    
    // Collections to keep (system/reference data)
    const collectionsToKeep = [
      'users', // Keep admin user
      'competitions' // Keep competition definitions
    ];
    
    console.log('🗑️  Resetting user-generated data...');
    
    for (const collection of collectionsToReset) {
      const result = await db.collection(collection).deleteMany({});
      console.log(`  ✓ ${collection}: ${result.deletedCount} documents removed`);
    }
    
    console.log('\n📋 Keeping system data:');
    for (const collection of collectionsToKeep) {
      const count = await db.collection(collection).countDocuments();
      console.log(`  ✓ ${collection}: ${count} documents preserved`);
    }
    
    console.log('\n🎉 Database reset completed successfully!');
    console.log('🚀 Ready to run: npm run seed-db (if needed)');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed');
  }
}

resetDB();