import { getTypedCollections } from './db-utils';
import bcrypt from 'bcryptjs';
import { MOCK_USERS, MOCK_COMPETITIONS, MOCK_WORKSHOPS } from './mock-data';

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

  // Seed Workshops from mock data
  console.log('🎟️ Seeding Workshops...');
  for (const workshop of MOCK_WORKSHOPS) {
    await collections.workshops.updateOne(
      { id: workshop.id },
      {
        $set: {
          name: workshop.name,
          track: workshop.track,
          instructor: workshop.instructor,
          description: workshop.description,
          schedule: new Date(workshop.schedule),
          duration_hours: workshop.duration_hours,
          capacity: workshop.capacity,
          enrolled: workshop.enrolled,
          materials_url: workshop.materials_url,
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

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Users: ${MOCK_USERS.length}`);
  console.log(`🏆 Competitions: ${MOCK_COMPETITIONS.length}`);
  console.log(`🎟️ Workshops: ${MOCK_WORKSHOPS.length}`);
}