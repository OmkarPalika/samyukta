// Quick debug script to check team member data
import { MongoClient } from 'mongodb';

async function debugTeamMembers() {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/samyukta');
  
  try {
    await client.connect();
    const db = client.db();
    
    console.log('=== DATABASE DEBUG ===');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Check registrations
    const registrations = await db.collection('registrations').find({}).limit(3).toArray();
    console.log(`\nFound ${registrations.length} registrations (showing first 3):`);
    
    registrations.forEach((reg, index) => {
      console.log(`\nRegistration ${index + 1}:`);
      console.log(`  _id: ${reg._id}`);
      console.log(`  team_id: ${reg.team_id}`);
      console.log(`  team_size: ${reg.team_size}`);
      console.log(`  status: ${reg.status}`);
    });
    
    // Check team_members collection
    const members = await db.collection('team_members').find({}).limit(3).toArray();
    console.log(`\nFound ${members.length} team members (showing first 3):`);
    
    members.forEach((member, index) => {
      console.log(`\nMember ${index + 1}:`);
      console.log(`  _id: ${member._id}`);
      console.log(`  participant_id: ${member.participant_id || 'MISSING'}`);
      console.log(`  full_name: ${member.full_name}`);
      console.log(`  email: ${member.email}`);
      console.log(`  registration_id: ${member.registration_id}`);
    });
    
    // Check if members are embedded in registrations
    const regWithMembers = await db.collection('registrations').findOne({});
    if (regWithMembers) {
      console.log('\nSample registration structure:');
      console.log('Has members field:', 'members' in regWithMembers);
      if (regWithMembers.members) {
        console.log('Members in registration:', regWithMembers.members.length);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

debugTeamMembers();