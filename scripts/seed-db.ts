#!/usr/bin/env tsx

import { config } from 'dotenv';
import { getTypedCollections } from '../src/lib/db-utils';
import { MOCK_USERS, MOCK_COMPETITIONS } from '../src/lib/mock-data';
import bcrypt from 'bcryptjs';

// Load environment variables
config({ path: '.env.local' });

async function main() {
  try {
    console.log('🌱 Seeding database...');
    const collections = await getTypedCollections();
    
    // Seed users from mock data
    console.log('👤 Seeding users...');
    for (const user of MOCK_USERS) {
      await collections.users.updateOne(
        { email: user.email },
        {
          $set: {
            full_name: user.full_name,
            password: await bcrypt.hash(user.password, 10),
            role: user.role,
            college: user.college,
            track: user.track,
            year: user.year,
            dept: user.dept,
            updated_at: new Date()
          },
          $setOnInsert: {
            created_at: new Date()
          }
        },
        { upsert: true }
      );
    }

    // Seed competitions from mock data
    console.log('🏆 Seeding competitions...');
    for (const comp of MOCK_COMPETITIONS) {
      await collections.competitions.updateOne(
        { name: comp.name },
        {
          $set: {
            description: comp.description,
            category: comp.category,
            max_team_size: comp.max_team_size,
            min_team_size: comp.min_team_size,
            registration_fee: comp.registration_fee,
            slots_available: comp.slots_available,
            slots_filled: comp.slots_filled,
            registration_deadline: new Date(comp.registration_deadline),
            competition_date: new Date(comp.competition_date),
            status: comp.status,
            requirements: comp.requirements,
            prizes: comp.prizes,
            updated_at: new Date()
          },
          $setOnInsert: {
            created_at: new Date()
          }
        },
        { upsert: true }
      );
    }
    
    console.log('✅ Database seeded successfully!');
    console.log(`👤 Users: ${MOCK_USERS.length} seeded`);
    console.log(`🏆 Competitions: ${MOCK_COMPETITIONS.length} seeded`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

main();