#!/usr/bin/env tsx

import { config } from 'dotenv';
import { MongoClient } from 'mongodb';
import { initializeDatabase } from '../src/lib/mongodb-schemas';

// Load environment variables
config({ path: '.env.local' });

async function initDB() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI environment variable is required');
    console.error('Make sure .env.local file exists with MONGODB_URI');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('samyukta');
    console.log('Initializing database collections and indexes...');
    await initializeDatabase(db);
    
    console.log('\n🎉 Database initialized successfully!');
    console.log('\n📋 Collections created:');
    console.log('  ✓ users');
    console.log('  ✓ registrations');
    console.log('  ✓ team_members');
    console.log('  ✓ competitions');
    console.log('  ✓ competition_registrations');
    console.log('  ✓ help_tickets');
    console.log('  ✓ social_items');
    console.log('  ✓ games');
    console.log('  ✓ pitch_ratings');
    console.log('  ✓ sessions');
    console.log('\n🚀 Ready to run: npm run seed-db');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed');
  }
}

initDB();