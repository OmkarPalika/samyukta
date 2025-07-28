import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getDbPromise, getCollections } from '../src/lib/mongodb';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
  try {
    const db = await getDbPromise();
    const { users } = getCollections(db);

    // Check if admin user already exists
    const existingAdmin = await users.findOne({ email: 'admin@samyukta.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const adminUser = {
      email: 'admin@samyukta.com',
      password: hashedPassword,
      full_name: 'Admin User',
      role: 'admin' as const,
      mobile_number: '9999999999',
      academic: {
        year: '4',
        department: 'CSE'
      },
      position: 'Administrator',
      committee: 'Core',
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await users.insertOne(adminUser);
    console.log('Admin user created successfully:', result.insertedId);
    console.log('Email: admin@samyukta.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

createAdminUser();