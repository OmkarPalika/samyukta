#!/usr/bin/env tsx

import { config } from 'dotenv';
import { seedDatabase } from '../src/lib/seed-data';

// Load environment variables
config({ path: '.env.local' });

async function main() {
  try {
    console.log('🌱 Seeding database...');
    await seedDatabase();
    console.log('✅ Database seeded successfully!');
    console.log('\n👤 Admin user created: omkar@samyukta.com / @Omkar143');
    console.log('🏆 Sample competitions added');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

main();