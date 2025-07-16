import { getTypedCollections } from './db-utils';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  try {
    const collections = await getTypedCollections();
    
    // Check if admin user already exists
    const existingAdmin = await collections.users.findOne({ email: 'admin@samyukta.com' });
    if (existingAdmin) {
      console.log('Database already seeded');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await collections.users.insertOne({
      email: 'admin@samyukta.com',
      full_name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
      college: 'ANITS',
      created_at: new Date(),
      updated_at: new Date()
    });

    // Create coordinator user
    const coordPassword = await bcrypt.hash('coord123', 12);
    await collections.users.insertOne({
      email: 'coordinator@samyukta.com',
      full_name: 'Coordinator User',
      password: coordPassword,
      role: 'coordinator',
      college: 'ANITS',
      created_at: new Date(),
      updated_at: new Date()
    });

    // Create sample participant
    await collections.teamMembers.insertOne({
      registration_id: 'sample_reg_001',
      participant_id: 'PART001',
      passkey: 'PART123',
      full_name: 'Participant User',
      email: 'participant@samyukta.com',
      whatsapp: '+919876543210',
      year: '3rd',
      department: 'CSE',
      college: 'ANITS',
      accommodation: false,
      food_preference: 'veg',
      present: false,
      created_at: new Date()
    });

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}