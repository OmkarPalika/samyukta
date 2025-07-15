#!/usr/bin/env tsx

import { config } from 'dotenv';
// Simplified seeding - just create admin user
import { getTypedCollections } from '../src/lib/db-utils';
import bcrypt from 'bcryptjs';

// Load environment variables
config({ path: '.env.local' });

async function main() {
  try {
    console.log('🌱 Seeding database...');
    const collections = await getTypedCollections();
    
    // Create admin user
    await collections.users.insertOne({
      email: 'omkar@samyukta.com',
      full_name: 'System Administrator',
      password: await bcrypt.hash('@Omkar143', 10),
      role: 'admin',
      college: 'ANITS',
      track: 'Admin',
      year: 'Convenor',
      dept: 'Administration',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    console.log('✅ Database seeded successfully!');
    console.log('👤 Admin user: omkar@samyukta.com / @Omkar143');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

main();