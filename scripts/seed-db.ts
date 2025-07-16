#!/usr/bin/env tsx

import { config } from 'dotenv';
import { getTypedCollections } from '../src/lib/db-utils';
import { MOCK_USERS, MOCK_COMPETITIONS, MOCK_WORKSHOPS } from '../src/lib/mock-data';
import getClientPromise from '../src/lib/mongodb';
import bcrypt from 'bcryptjs';

// Load environment variables
config({ path: '.env.local' });

async function main() {
  let client;
  try {
    console.log('🌱 Seeding database...');
    client = await getClientPromise();
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

    // Seed workshops from mock data
    console.log('🎓 Seeding workshops...');
    for (const workshop of MOCK_WORKSHOPS) {
      await collections.workshops.updateOne(
        { name: workshop.name },
        {
          $set: {
            track: workshop.track,
            instructor: workshop.instructor,
            description: workshop.description,
            schedule: new Date(workshop.schedule),
            duration_hours: workshop.duration_hours,
            capacity: workshop.capacity,
            enrolled: workshop.enrolled,
            status: workshop.status,
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
    console.log(`🎓 Workshops: ${MOCK_WORKSHOPS.length} seeded`);
    console.log(`🏆 Competitions: ${MOCK_COMPETITIONS.length} seeded`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
    }
    process.exit(0);
  }
}

main();