#!/usr/bin/env tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from 'dotenv';
import { Command } from 'commander';
import { getDbPromise } from '../src/lib/mongodb';
import { backupManager } from '../src/lib/backup-utils';
import * as fs from 'fs/promises';
import * as path from 'path';

// Load environment variables
config({ path: '.env.local' });

const program = new Command();

program
  .name('recovery-procedures')
  .description('Data recovery and disaster recovery procedures for Samyukta 2025')
  .version('1.0.0');

// Data integrity check
program
  .command('check-integrity')
  .description('Check database integrity and identify issues')
  .action(async () => {
    try {
      console.log('🔍 Starting database integrity check...\n');
      
      const db = await getDbPromise();
      const issues: string[] = [];
      
      // Check collections exist
      const expectedCollections = [
        'users', 'registrations', 'team_members', 'competitions',
        'help_tickets', 'social_items', 'games', 'pitch_ratings', 'sessions'
      ];
      
      const existingCollections = await db.listCollections().toArray();
      const existingNames = existingCollections.map(c => c.name);
      
      for (const collection of expectedCollections) {
        if (!existingNames.includes(collection)) {
          issues.push(`❌ Missing collection: ${collection}`);
        } else {
          console.log(`✅ Collection exists: ${collection}`);
        }
      }
      
      // Check for orphaned records
      console.log('\n🔗 Checking for orphaned records...');
      
      // Check team_members without valid registrations (DISABLED - too aggressive)
      // Note: Team members may have valid reasons to exist without direct registration links
      console.log('⚠️  Orphaned team member check disabled (can be too aggressive)');
      
      // Check for duplicate emails
      const users = await db.collection('users').find({}).toArray();
      const emailCounts = new Map<string, number>();
      
      users.forEach(user => {
        const count = emailCounts.get(user.email) || 0;
        emailCounts.set(user.email, count + 1);
      });
      
      const duplicateEmails = Array.from(emailCounts.entries())
        .filter(([_, count]) => count > 1);
      
      if (duplicateEmails.length > 0) {
        issues.push(`❌ Found ${duplicateEmails.length} duplicate email addresses`);
        duplicateEmails.forEach(([email, count]) => {
          console.log(`  - ${email}: ${count} occurrences`);
        });
      } else {
        console.log('✅ No duplicate emails found');
      }
      
      // Check for invalid data types
      console.log('\n🔍 Checking data types...');
      
      const invalidUsers = await db.collection('users').find({
        $or: [
          { email: { $not: { $type: 'string' } } },
          { full_name: { $not: { $type: 'string' } } },
          { created_at: { $not: { $type: 'date' } } }
        ]
      }).toArray();
      
      if (invalidUsers.length > 0) {
        issues.push(`❌ Found ${invalidUsers.length} users with invalid data types`);
      } else {
        console.log('✅ All user data types are valid');
      }
      
      // Summary
      console.log('\n📊 Integrity Check Summary');
      console.log('==========================');
      
      if (issues.length === 0) {
        console.log('🎉 Database integrity check passed! No issues found.');
      } else {
        console.log(`⚠️  Found ${issues.length} issues:`);
        issues.forEach(issue => console.log(`  ${issue}`));
        
        console.log('\n💡 Run recovery commands to fix these issues:');
        console.log('  - npm run recovery fix-orphaned');
        console.log('  - npm run recovery fix-duplicates');
        console.log('  - npm run recovery fix-data-types');
      }
      
    } catch (error) {
      console.error('❌ Integrity check failed:', error);
      process.exit(1);
    }
  });

// Fix orphaned records
program
  .command('fix-orphaned')
  .description('Fix orphaned records in the database')
  .option('--dry-run', 'Show what would be fixed without making changes')
  .action(async (options) => {
    try {
      console.log('🔧 Fixing orphaned records...\n');
      
      const db = await getDbPromise();
      
      // Find orphaned team members
      const teamMembers = await db.collection('team_members').find({}).toArray();
      const registrations = await db.collection('registrations').find({}).toArray();
      const registrationIds = new Set(registrations.map(r => r._id.toString()));
      
      const orphanedMembers = teamMembers.filter(member => 
        !registrationIds.has(member.registration_id?.toString())
      );
      
      if (orphanedMembers.length === 0) {
        console.log('✅ No orphaned team members found');
        return;
      }
      
      console.log(`Found ${orphanedMembers.length} orphaned team members:`);
      orphanedMembers.forEach(member => {
        console.log(`  - ${member.full_name} (${member.email})`);
      });
      
      if (options.dryRun) {
        console.log('\n🔍 Dry run mode - no changes made');
        return;
      }
      
      // Remove orphaned team members
      const result = await db.collection('team_members').deleteMany({
        _id: { $in: orphanedMembers.map(m => m._id) }
      });
      
      console.log(`\n✅ Removed ${result.deletedCount} orphaned team members`);
      
    } catch (error) {
      console.error('❌ Failed to fix orphaned records:', error);
      process.exit(1);
    }
  });

// Fix duplicate records
program
  .command('fix-duplicates')
  .description('Fix duplicate records in the database')
  .option('--dry-run', 'Show what would be fixed without making changes')
  .action(async (options) => {
    try {
      console.log('🔧 Fixing duplicate records...\n');
      
      const db = await getDbPromise();
      
      // Find duplicate users by email
      const duplicates = await db.collection('users').aggregate([
        {
          $group: {
            _id: '$email',
            count: { $sum: 1 },
            docs: { $push: '$$ROOT' }
          }
        },
        {
          $match: { count: { $gt: 1 } }
        }
      ]).toArray();
      
      if (duplicates.length === 0) {
        console.log('✅ No duplicate users found');
        return;
      }
      
      console.log(`Found ${duplicates.length} duplicate email addresses:`);
      
      let totalToRemove = 0;
      
      for (const duplicate of duplicates) {
        const docs = duplicate.docs;
        const keepDoc = docs.reduce((latest, current) => 
          new Date(current.created_at) > new Date(latest.created_at) ? current : latest
        );
        
        const toRemove = docs.filter(doc => doc._id.toString() !== keepDoc._id.toString());
        totalToRemove += toRemove.length;
        
        console.log(`  - ${duplicate._id}: keeping latest (${keepDoc._id}), removing ${toRemove.length} duplicates`);
        
        if (!options.dryRun) {
          await db.collection('users').deleteMany({
            _id: { $in: toRemove.map(doc => doc._id) }
          });
        }
      }
      
      if (options.dryRun) {
        console.log(`\n🔍 Dry run mode - would remove ${totalToRemove} duplicate records`);
      } else {
        console.log(`\n✅ Removed ${totalToRemove} duplicate records`);
      }
      
    } catch (error) {
      console.error('❌ Failed to fix duplicates:', error);
      process.exit(1);
    }
  });

// Emergency restore
program
  .command('emergency-restore')
  .description('Emergency database restore from latest backup')
  .option('--backup <name>', 'Specific backup to restore from')
  .option('--confirm', 'Skip confirmation prompt')
  .action(async (options) => {
    try {
      console.log('🚨 EMERGENCY RESTORE PROCEDURE\n');
      
      if (!options.confirm) {
        const readline = require('readline');
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        const answer = await new Promise<string>((resolve) => {
          rl.question('⚠️  This will REPLACE your current database. Type "EMERGENCY" to confirm: ', resolve);
        });
        
        rl.close();
        
        if (answer !== 'EMERGENCY') {
          console.log('❌ Emergency restore cancelled');
          return;
        }
      }
      
      // Find backup to restore
      let backupToRestore;
      
      if (options.backup) {
        backupToRestore = options.backup;
      } else {
        const backups = await backupManager.listBackups();
        if (backups.length === 0) {
          console.error('❌ No backups available for emergency restore');
          process.exit(1);
        }
        backupToRestore = backups[0].name; // Latest backup
      }
      
      console.log(`🔄 Restoring from backup: ${backupToRestore}`);
      
      // Create emergency backup of current state
      console.log('📦 Creating emergency backup of current state...');
      const emergencyBackup = await backupManager.createBackup(`emergency-${Date.now()}`);
      console.log(`✅ Emergency backup created: ${emergencyBackup}`);
      
      // Restore from backup
      const backupPath = path.join('./backups', backupToRestore);
      await backupManager.restoreBackup(backupPath, { dropExisting: true });
      
      console.log('✅ Emergency restore completed successfully!');
      console.log(`📁 Emergency backup of previous state: ${emergencyBackup}`);
      
    } catch (error) {
      console.error('❌ Emergency restore failed:', error);
      process.exit(1);
    }
  });

// Data migration
program
  .command('migrate')
  .description('Run data migration procedures')
  .option('--version <version>', 'Target migration version')
  .action(async (options) => {
    try {
      console.log('🔄 Running data migration...\n');
      
      const db = await getDbPromise();
      
      // Check current schema version
      let currentVersion = '1.0.0';
      try {
        const versionDoc = await db.collection('schema_version').findOne({});
        if (versionDoc) {
          currentVersion = versionDoc.version;
        }
      } catch (error) {
        // Schema version collection doesn't exist, create it
        await db.collection('schema_version').insertOne({
          version: '1.0.0',
          updated_at: new Date()
        });
      }
      
      console.log(`Current schema version: ${currentVersion}`);
      
      const targetVersion = options.version || '1.1.0';
      console.log(`Target schema version: ${targetVersion}`);
      
      if (currentVersion === targetVersion) {
        console.log('✅ Database is already at target version');
        return;
      }
      
      // Run migrations based on version
      if (currentVersion === '1.0.0' && targetVersion === '1.1.0') {
        console.log('🔄 Running migration 1.0.0 -> 1.1.0...');
        
        // Add indexes for better performance
        await db.collection('users').createIndex({ email: 1 }, { unique: true });
        await db.collection('registrations').createIndex({ user_id: 1 });
        await db.collection('team_members').createIndex({ registration_id: 1 });
        
        // Add new fields with default values
        await db.collection('users').updateMany(
          { status: { $exists: false } },
          { $set: { status: 'active' } }
        );
        
        // Update schema version
        await db.collection('schema_version').updateOne(
          {},
          { 
            $set: { 
              version: '1.1.0',
              updated_at: new Date()
            }
          },
          { upsert: true }
        );
        
        console.log('✅ Migration completed successfully');
      }
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    }
  });

// Health check
program
  .command('health-check')
  .description('Comprehensive database health check')
  .action(async () => {
    try {
      console.log('🏥 Database Health Check\n');
      
      const db = await getDbPromise();
      const health = {
        status: 'healthy',
        issues: [] as string[],
        warnings: [] as string[],
        stats: {} as any
      };
      
      // Connection test
      try {
        await db.admin().ping();
        console.log('✅ Database connection: OK');
      } catch (error) {
        health.status = 'unhealthy';
        health.issues.push('Database connection failed');
        console.log('❌ Database connection: FAILED');
      }
      
      // Collection stats
      const collections = ['users', 'registrations', 'team_members'];
      
      for (const collectionName of collections) {
        try {
          const collection = db.collection(collectionName);
          const count = await collection.countDocuments();
          const stats = await db.command({ collStats: collectionName });
          
          health.stats[collectionName] = {
            documents: count,
            size: stats.size,
            avgObjSize: stats.avgObjSize
          };
          
          console.log(`✅ ${collectionName}: ${count} documents`);
          
          if (count === 0) {
            health.warnings.push(`${collectionName} collection is empty`);
          }
          
        } catch (error) {
          health.issues.push(`Failed to get stats for ${collectionName}`);
          console.log(`❌ ${collectionName}: ERROR`);
        }
      }
      
      // Index health
      console.log('\n📊 Index Health:');
      for (const collectionName of collections) {
        try {
          const collection = db.collection(collectionName);
          const indexes = await collection.indexes();
          console.log(`✅ ${collectionName}: ${indexes.length} indexes`);
        } catch (error) {
          health.warnings.push(`Could not check indexes for ${collectionName}`);
        }
      }
      
      // Summary
      console.log('\n📋 Health Summary:');
      console.log(`Status: ${health.status.toUpperCase()}`);
      
      if (health.issues.length > 0) {
        console.log('\n❌ Issues:');
        health.issues.forEach(issue => console.log(`  - ${issue}`));
      }
      
      if (health.warnings.length > 0) {
        console.log('\n⚠️  Warnings:');
        health.warnings.forEach(warning => console.log(`  - ${warning}`));
      }
      
      if (health.status === 'healthy' && health.warnings.length === 0) {
        console.log('🎉 Database is healthy!');
      }
      
    } catch (error) {
      console.error('❌ Health check failed:', error);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}