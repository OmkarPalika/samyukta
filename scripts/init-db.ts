#!/usr/bin/env tsx

import { config } from 'dotenv';
import { getDbPromise } from '../src/lib/mongodb';
import { initializeDatabase } from '../src/lib/mongodb-schemas';
import getClientPromise from '../src/lib/mongodb';

// Load environment variables
config({ path: '.env.local' });

async function main() {
  let client;
  try {
    console.log('🔧 Initializing database...');
    
    client = await getClientPromise();
    const db = await getDbPromise();
    await initializeDatabase(db);
    
    console.log('✅ Database initialized successfully!');
    console.log('📊 Collections and indexes created');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
    }
    process.exit(0);
  }
}

main();