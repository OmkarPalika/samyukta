import { getTypedCollections } from './db-utils';
import bcrypt from 'bcryptjs';
import { MOCK_USERS, MOCK_COMPETITIONS } from './mock-data';

export async function seedDatabase() {
  const collections = await getTypedCollections();

  console.log('🌱 Starting database seeding...');

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
  for (const competition of MOCK_COMPETITIONS) {
    await collections.competitions.updateOne(
      { name: competition.name },
      {
        $set: {
          description: competition.description,
          category: competition.category,
          max_team_size: competition.max_team_size,
          min_team_size: competition.min_team_size,
          registration_fee: competition.registration_fee,
          slots_available: competition.slots_available,
          slots_filled: competition.slots_filled,
          registration_deadline: new Date(competition.registration_deadline),
          competition_date: new Date(competition.competition_date),
          status: competition.status,
          requirements: competition.requirements,
          prizes: competition.prizes,
          updated_at: new Date()
        },
        $setOnInsert: {
          created_at: new Date()
        }
      },
      { upsert: true }
    );
  }

  // Seed sample help tickets
  console.log('🎟️ Seeding sample help tickets...');
  const sampleTickets = [
    {
      submitted_by: 'PART001',
      title: 'Login Issue',
      description: 'Cannot access dashboard with my credentials',
      status: 'open' as const,
      priority: 'medium' as const
    },
    {
      submitted_by: 'PART002',
      title: 'Payment Verification',
      description: 'Payment completed but status not updated',
      status: 'in_progress' as const,
      priority: 'high' as const
    }
  ];

  for (const ticket of sampleTickets) {
    await collections.helpTickets.updateOne(
      { title: ticket.title, submitted_by: ticket.submitted_by },
      {
        $set: {
          ...ticket,
          updated_at: new Date()
        },
        $setOnInsert: {
          created_at: new Date()
        }
      },
      { upsert: true }
    );
  }

  // Seed sample social items
  console.log('📷 Seeding sample social items...');
  const sampleSocialItems = [
    {
      uploaded_by: 'admin',
      caption: 'Welcome to Samyukta 2025! 🎉',
      file_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      status: 'approved' as const,
      category: 'announcement',
      likes: 45,
      comments: 12,
      shares: 8,
      tags: ['welcome', 'samyukta2025', 'announcement']
    },
    {
      uploaded_by: 'coord1',
      caption: 'AWS Workshop preparations underway ☁️',
      file_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop',
      status: 'approved' as const,
      category: 'workshop',
      likes: 32,
      comments: 8,
      shares: 5,
      tags: ['aws', 'workshop', 'cloud']
    }
  ];

  for (const item of sampleSocialItems) {
    await collections.socialItems.updateOne(
      { caption: item.caption, uploaded_by: item.uploaded_by },
      {
        $set: {
          ...item,
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
  console.log(`👤 Users: ${MOCK_USERS.length}`);
  console.log(`🏆 Competitions: ${MOCK_COMPETITIONS.length}`);
  console.log(`🎟️ Help Tickets: ${sampleTickets.length}`);
  console.log(`📷 Social Items: ${sampleSocialItems.length}`);
}