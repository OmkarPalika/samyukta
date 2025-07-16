#!/usr/bin/env tsx

import { config } from 'dotenv';
import { getDbPromise } from '../src/lib/mongodb';
import { initializeDatabase } from '../src/lib/mongodb-schemas';

// Load environment variables
config({ path: '.env.local' });

async function main() {
  try {
    console.log('🔧 Initializing database...');
    
    const db = await getDbPromise();
    await initializeDatabase(db);
    
    console.log('✅ Database initialized successfully!');
    console.log('📊 Collections and indexes created');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

main();