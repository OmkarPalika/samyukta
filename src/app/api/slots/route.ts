import { NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const collections = await getTypedCollections();
    
    // Get registration counts
    const totalCount = await collections.teamMembers.countDocuments({});
    
    const cloudCount = await collections.registrations.aggregate([
      { $match: { workshop_track: 'Cloud' } },
      { $group: { _id: null, total: { $sum: '$team_size' } } }
    ]).toArray().then(result => result[0]?.total || 0);
    
    const aiCount = await collections.registrations.aggregate([
      { $match: { workshop_track: 'AI' } },
      { $group: { _id: null, total: { $sum: '$team_size' } } }
    ]).toArray().then(result => result[0]?.total || 0);
    
    const cybersecurityCount = await collections.registrations.aggregate([
      { $match: { workshop_track: 'Cybersecurity' } },
      { $group: { _id: null, total: { $sum: '$team_size' } } }
    ]).toArray().then(result => result[0]?.total || 0);
    
    const hackathonCount = await collections.registrations.aggregate([
      { $match: { competition_track: 'Hackathon' } },
      { $group: { _id: null, total: { $sum: '$team_size' } } }
    ]).toArray().then(result => result[0]?.total || 0);
    
    const pitchCount = await collections.registrations.aggregate([
      { $match: { competition_track: 'Pitch' } },
      { $group: { _id: null, total: { $sum: '$team_size' } } }
    ]).toArray().then(result => result[0]?.total || 0);
    
    // Get all confirmed registrations first
    const confirmedRegistrations = await collections.registrations.find(
      { status: 'confirmed' }
    ).toArray();
    
    const confirmedTeamIds = confirmedRegistrations.map(reg => reg.team_id);
    
    // Count accommodation requests only from confirmed registrations
    const maleAccommodationCount = await collections.teamMembers.countDocuments({
      accommodation: true,
      gender: 'Male',
      registration_id: { $in: confirmedTeamIds }
    });
    
    const femaleAccommodationCount = await collections.teamMembers.countDocuments({
      accommodation: true,
      gender: 'Female',
      registration_id: { $in: confirmedTeamIds }
    });
    
    // Define limits
    const MAX_TOTAL = 400;
    const MAX_CLOUD = 200;
    const MAX_AI = 200;
    const MAX_CYBERSECURITY = 100;
    const MAX_HACKATHON = 250;
    const MAX_PITCH = 250;
    const MAX_MALE_ACCOMMODATION = 50;
    const MAX_FEMALE_ACCOMMODATION = 50;
    
    // Calculate remaining slots
    const remaining_total = Math.max(0, MAX_TOTAL - totalCount);
    const remaining_cloud = Math.max(0, MAX_CLOUD - cloudCount);
    const remaining_ai = Math.max(0, MAX_AI - aiCount);
    const remaining_cybersecurity = Math.max(0, MAX_CYBERSECURITY - cybersecurityCount);
    const remaining_hackathon = Math.max(0, MAX_HACKATHON - hackathonCount);
    const remaining_pitch = Math.max(0, MAX_PITCH - pitchCount);
    const remaining_male_accommodation = Math.max(0, MAX_MALE_ACCOMMODATION - maleAccommodationCount);
    const remaining_female_accommodation = Math.max(0, MAX_FEMALE_ACCOMMODATION - femaleAccommodationCount);
    
    // Consolidated slot data
    const slotData = {
      // Overall stats
      total: {
        registered: totalCount,
        max: MAX_TOTAL,
        remaining: remaining_total,
        closed: totalCount >= MAX_TOTAL
      },
      
      // Workshop tracks
      workshops: {
        cloud: {
          registered: cloudCount,
          max: MAX_CLOUD,
          remaining: remaining_cloud,
          closed: cloudCount >= MAX_CLOUD
        },
        ai: {
          registered: aiCount,
          max: MAX_AI,
          remaining: remaining_ai,
          closed: aiCount >= MAX_AI
        },
        cybersecurity: {
          registered: cybersecurityCount,
          max: MAX_CYBERSECURITY,
          remaining: remaining_cybersecurity,
          closed: cybersecurityCount >= MAX_CYBERSECURITY
        }
      },
      
      // Competition tracks
      competitions: {
        hackathon: {
          registered: hackathonCount,
          max: MAX_HACKATHON,
          remaining: remaining_hackathon,
          closed: hackathonCount >= MAX_HACKATHON,
          category: 'Hackathon',
          slots_available: MAX_HACKATHON,
          slots_filled: hackathonCount
        },
        pitch: {
          registered: pitchCount,
          max: MAX_PITCH,
          remaining: remaining_pitch,
          closed: pitchCount >= MAX_PITCH,
          category: 'Pitch',
          slots_available: MAX_PITCH,
          slots_filled: pitchCount
        }
      },
      
      // Accommodation
      accommodation: {
        male: {
          registered: maleAccommodationCount,
          max: MAX_MALE_ACCOMMODATION,
          remaining: remaining_male_accommodation,
          closed: maleAccommodationCount >= MAX_MALE_ACCOMMODATION
        },
        female: {
          registered: femaleAccommodationCount,
          max: MAX_FEMALE_ACCOMMODATION,
          remaining: remaining_female_accommodation,
          closed: femaleAccommodationCount >= MAX_FEMALE_ACCOMMODATION
        }
      },
      
      // Direct join availability (disabled)
      direct_join: {
        available: false,
        hackathon_price: 400,
        pitch_price: 300
      },
      
      // Pitch mode configuration
      pitch_mode_enabled: totalCount >= 350,
      
      // Legacy format for backward compatibility
      remaining_total,
      remaining_cloud,
      remaining_ai,
      remaining_cybersecurity,
      remaining_hackathon,
      remaining_pitch,
      total_registrations: totalCount,
      cloud_workshop: cloudCount,
      ai_workshop: aiCount,
      cybersecurity_workshop: cybersecurityCount,
      hackathon_competition: hackathonCount,
      pitch_competition: pitchCount,
      max_total: MAX_TOTAL,
      max_cloud: MAX_CLOUD,
      max_ai: MAX_AI,
      max_cybersecurity: MAX_CYBERSECURITY,
      max_hackathon: MAX_HACKATHON,
      max_pitch: MAX_PITCH,
      event_closed: totalCount >= MAX_TOTAL,
      cloud_closed: cloudCount >= MAX_CLOUD,
      ai_closed: aiCount >= MAX_AI,
      cybersecurity_closed: cybersecurityCount >= MAX_CYBERSECURITY,
      hackathon_closed: hackathonCount >= MAX_HACKATHON,
      pitch_closed: pitchCount >= MAX_PITCH,
      direct_join_available: false,
      direct_join_hackathon_price: 400,
      direct_join_pitch_price: 300
    };
    
    return NextResponse.json(slotData, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Failed to fetch slot data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slot information' },
      { status: 500 }
    );
  }
}
