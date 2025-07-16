#!/usr/bin/env tsx

import { config } from 'dotenv';
import { getTypedCollections } from '../src/lib/db-utils';
import getClientPromise from '../src/lib/mongodb';

// Load environment variables
config({ path: '.env.local' });

async function main() {
  let client;
  try {
    console.log('🗑️ Resetting database...');
    
    client = await getClientPromise();
    const collections = await getTypedCollections();
    
    // Clear all collections
    await Promise.all([
      collections.users.deleteMany({}),
      collections.registrations.deleteMany({}),
      collections.teamMembers.deleteMany({}),
      collections.workshops.deleteMany({}),
      collections.competitions.deleteMany({}),
      collections.competitionRegistrations.deleteMany({}),
      collections.helpTickets.deleteMany({}),
      collections.socialItems.deleteMany({}),
      collections.games.deleteMany({}),
      collections.pitchRatings.deleteMany({}),
      collections.sessions.deleteMany({})
    ]);
    
    console.log('✅ Database reset successfully!');
    console.log('🗑️ All collections cleared');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
    }
    process.exit(0);
  }
}

main();