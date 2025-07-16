#!/usr/bin/env tsx

import { config } from 'dotenv';
import { getTypedCollections } from '../src/lib/db-utils';

// Load environment variables
config({ path: '.env.local' });

async function main() {
  try {
    console.log('🗑️ Resetting database...');
    
    const collections = await getTypedCollections();
    
    // Clear all collections
    await Promise.all([
      collections.users.deleteMany({}),
      collections.registrations.deleteMany({}),
      collections.teamMembers.deleteMany({}),
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
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
}

main();