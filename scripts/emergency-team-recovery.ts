#!/usr/bin/env tsx

import { config } from 'dotenv';
import { getDbPromise } from '../src/lib/mongodb';
import * as fs from 'fs/promises';
import * as path from 'path';
import { createGunzip } from 'zlib';
import { pipeline } from 'stream/promises';

// Load environment variables
config({ path: '.env.local' });

async function emergencyTeamMembersRecovery() {
  try {
    console.log('🚨 EMERGENCY TEAM MEMBERS RECOVERY');
    console.log('==================================\n');

    const db = await getDbPromise();
    
    // The backup that contains the team members (before cleanup)
    const backupName = 'samyukta-backup-2025-07-27T05-22-07-806Z';
    const backupPath = path.join('./backups', backupName);
    
    console.log(`📁 Using backup: ${backupName}`);
    
    // Check if backup exists
    try {
      await fs.access(backupPath);
    } catch (error) {
      console.error('❌ Backup not found!');
      process.exit(1);
    }
    
    // Read the team_members collection from backup
    const teamMembersFile = path.join(backupPath, 'team_members.json.gz');
    
    console.log('📖 Reading team members from backup...');
    
    // Decompress and read the team members data
    const compressedData = await fs.readFile(teamMembersFile);
    const decompressed = await new Promise<Buffer>((resolve, reject) => {
      const gunzip = createGunzip();
      const chunks: Buffer[] = [];
      
      gunzip.on('data', (chunk) => chunks.push(chunk));
      gunzip.on('end', () => resolve(Buffer.concat(chunks)));
      gunzip.on('error', reject);
      
      gunzip.write(compressedData);
      gunzip.end();
    });
    
    const teamMembersData = JSON.parse(decompressed.toString());
    
    console.log(`✅ Found ${teamMembersData.length} team members in backup`);
    
    // Show current state
    const currentTeamMembers = await db.collection('team_members').countDocuments();
    console.log(`📊 Current team members in database: ${currentTeamMembers}`);
    
    if (teamMembersData.length === 0) {
      console.log('⚠️  No team members found in backup');
      return;
    }
    
    // Show some sample data to confirm
    console.log('\n📋 Sample team members to be restored:');
    teamMembersData.slice(0, 5).forEach((member: any, index: number) => {
      console.log(`  ${index + 1}. ${member.full_name} (${member.email})`);
    });
    
    if (teamMembersData.length > 5) {
      console.log(`  ... and ${teamMembersData.length - 5} more`);
    }
    
    // Confirmation
    console.log('\n⚠️  This will restore ALL team members from the backup.');
    console.log('   Existing team members (if any) will be preserved.');
    
    // Auto-proceed since this is emergency recovery
    console.log('🚀 Proceeding with emergency recovery...');

    
    console.log('\n🔄 Starting team members recovery...');
    
    // Create a backup of current state first
    const emergencyBackupName = `emergency-before-team-recovery-${Date.now()}`;
    console.log(`📦 Creating emergency backup: ${emergencyBackupName}`);
    
    const currentData = await db.collection('team_members').find({}).toArray();
    const emergencyBackupPath = path.join('./backups', emergencyBackupName);
    await fs.mkdir(emergencyBackupPath, { recursive: true });
    await fs.writeFile(
      path.join(emergencyBackupPath, 'team_members_current.json'),
      JSON.stringify(currentData, null, 2)
    );
    
    // Restore team members
    // Use upsert to avoid duplicates based on email + registration_id combination
    let restoredCount = 0;
    let skippedCount = 0;
    
    for (const member of teamMembersData) {
      try {
        // Check if this exact member already exists
        const existing = await db.collection('team_members').findOne({
          email: member.email,
          full_name: member.full_name,
          registration_id: member.registration_id
        });
        
        if (existing) {
          skippedCount++;
          continue;
        }
        
        // Insert the member
        await db.collection('team_members').insertOne(member);
        restoredCount++;
        
        if (restoredCount % 10 === 0) {
          console.log(`  ✓ Restored ${restoredCount} team members...`);
        }
        
      } catch (error) {
        console.log(`  ⚠️  Skipped ${member.full_name}: ${error}`);
        skippedCount++;
      }
    }
    
    console.log('\n✅ RECOVERY COMPLETED!');
    console.log('=====================');
    console.log(`📊 Team members restored: ${restoredCount}`);
    console.log(`📊 Team members skipped (duplicates): ${skippedCount}`);
    console.log(`📊 Total team members now: ${await db.collection('team_members').countDocuments()}`);
    
    console.log(`\n💾 Emergency backup of previous state saved to: ${emergencyBackupPath}`);
    
    // Verify the restoration
    console.log('\n🔍 Verification:');
    const finalCount = await db.collection('team_members').countDocuments();
    console.log(`✅ Final team members count: ${finalCount}`);
    
    // Show some restored members
    const sampleRestored = await db.collection('team_members').find({}).limit(5).toArray();
    console.log('\n📋 Sample restored team members:');
    sampleRestored.forEach((member, index) => {
      console.log(`  ${index + 1}. ${member.full_name} (${member.email})`);
    });
    
    console.log('\n🎉 Team members have been successfully recovered!');
    
  } catch (error) {
    console.error('❌ Recovery failed:', error);
    process.exit(1);
  }
}

// Run the recovery
emergencyTeamMembersRecovery();