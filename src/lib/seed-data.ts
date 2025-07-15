import { getTypedCollections } from './db-utils';
import bcrypt from 'bcryptjs';
import { MOCK_USERS, MOCK_COMPETITIONS } from './mock-data';

export async function seedDatabase() {
  const collections = await getTypedCollections();

  // Reset existing data first
  await collections.users.deleteMany({});
  await collections.competitions.deleteMany({});
  await collections.helpTickets.deleteMany({});
  await collections.socialItems.deleteMany({});
  console.log('🗑️ Existing data cleared');

  // Seed users from mock data
  for (const user of MOCK_USERS) {
    await collections.users.insertOne({
      email: user.email,
      full_name: user.full_name,
      password: await bcrypt.hash(user.password, 10),
      role: user.role,
      college: user.college,
      track: user.track,
      year: user.year,
      dept: user.dept,
      created_at: new Date(),
      updated_at: new Date()
    });
  }

  // Seed competitions from mock data
  for (const competition of MOCK_COMPETITIONS) {
    await collections.competitions.insertOne({
      name: competition.name,
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
      created_at: new Date(),
      updated_at: new Date()
    });
  }

  // // Seed help tickets from mock data
  // for (const ticket of MOCK_HELP_TICKETS) {
  //   await collections.helpTickets.insertOne({
  //     submitted_by: ticket.submitted_by,
  //     title: ticket.title,
  //     description: ticket.description,
  //     status: ticket.status,
  //     priority: ticket.priority,
  //     created_at: new Date(ticket.created_at),
  //     updated_at: new Date()
  //   });
  // }

  // // Seed social items from mock data
  // for (const item of MOCK_SOCIAL_ITEMS) {
  //   await collections.socialItems.insertOne({
  //     uploaded_by: item.uploaded_by,
  //     caption: item.caption,
  //     file_url: item.file_url,
  //     status: item.status,
  //     category: item.category,
  //     likes: item.likes,
  //     comments: item.comments,
  //     shares: item.shares,
  //     tags: item.tags,
  //     created_at: new Date(item.created_at),
  //     updated_at: new Date()
  //   });
  // }

  console.log('Database seeded successfully');
}