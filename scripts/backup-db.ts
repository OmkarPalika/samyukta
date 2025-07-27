#!/usr/bin/env tsx

import { config } from 'dotenv';
import { createDatabaseBackup, listDatabaseBackups, exportDatabaseData } from '../src/lib/backup-utils';
import { Command } from 'commander';

// Load environment variables
config({ path: '.env.local' });

const program = new Command();

program
  .name('backup-db')
  .description('Database backup and export utilities for Samyukta 2025')
  .version('1.0.0');

// Create backup command
program
  .command('create')
  .description('Create a new database backup')
  .option('-n, --name <name>', 'Custom backup name')
  .action(async (options) => {
    try {
      console.log('🚀 Starting database backup...');
      const backupPath = await createDatabaseBackup(options.name);
      console.log(`✅ Backup created successfully at: ${backupPath}`);
    } catch (error) {
      console.error('❌ Backup failed:', error);
      process.exit(1);
    }
  });

// List backups command
program
  .command('list')
  .description('List all available backups')
  .action(async () => {
    try {
      console.log('📋 Listing available backups...\n');
      const backups = await listDatabaseBackups();
      
      if (backups.length === 0) {
        console.log('No backups found.');
        return;
      }

      console.log('Available backups:');
      console.log('==================');
      
      backups.forEach((backup, index) => {
        console.log(`${index + 1}. ${backup.name}`);
        console.log(`   📅 Created: ${new Date(backup.metadata.timestamp).toLocaleString()}`);
        console.log(`   📊 Collections: ${backup.metadata.collections.length}`);
        console.log(`   📄 Documents: ${backup.metadata.totalDocuments.toLocaleString()}`);
        console.log(`   💾 Size: ${formatBytes(backup.size)}`);
        console.log('');
      });
    } catch (error) {
      console.error('❌ Failed to list backups:', error);
      process.exit(1);
    }
  });

// Export data command
program
  .command('export')
  .description('Export database data to various formats')
  .option('-f, --format <format>', 'Export format (json, csv, xlsx)', 'json')
  .option('-c, --collections <collections>', 'Comma-separated list of collections to export')
  .option('-o, --output <path>', 'Output file path')
  .option('-q, --query <query>', 'JSON query to filter data')
  .action(async (options) => {
    try {
      console.log(`🚀 Starting data export in ${options.format} format...`);
      
      const exportOptions: any = {};
      
      if (options.collections) {
        exportOptions.collections = options.collections.split(',').map((c: string) => c.trim());
      }
      
      if (options.output) {
        exportOptions.outputPath = options.output;
      }
      
      if (options.query) {
        try {
          exportOptions.query = JSON.parse(options.query);
        } catch (error) {
          console.error('❌ Invalid JSON query:', error);
          process.exit(1);
        }
      }
      
      const exportPath = await exportDatabaseData(options.format, exportOptions);
      console.log(`✅ Data exported successfully to: ${exportPath}`);
    } catch (error) {
      console.error('❌ Export failed:', error);
      process.exit(1);
    }
  });

// Automated backup command
program
  .command('auto')
  .description('Create automated backup with cleanup')
  .option('-s, --schedule <schedule>', 'Backup schedule (daily, weekly, monthly)', 'daily')
  .option('-k, --keep <number>', 'Number of backups to keep', '7')
  .action(async (options) => {
    try {
      console.log(`🤖 Starting automated backup (${options.schedule})...`);
      
      const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const backupName = `auto-${options.schedule}-${timestamp}`;
      
      const backupPath = await createDatabaseBackup(backupName);
      console.log(`✅ Automated backup created: ${backupPath}`);
      
      // List and cleanup old backups
      const backups = await listDatabaseBackups();
      const autoBackups = backups.filter(b => b.name.startsWith(`auto-${options.schedule}-`));
      
      if (autoBackups.length > parseInt(options.keep)) {
        const { deleteDatabaseBackup } = await import('../src/lib/backup-utils');
        const backupsToDelete = autoBackups.slice(parseInt(options.keep));
        
        for (const backup of backupsToDelete) {
          await deleteDatabaseBackup(backup.name);
          console.log(`🗑️ Deleted old backup: ${backup.name}`);
        }
      }
      
      console.log(`✅ Automated backup completed. Keeping ${Math.min(autoBackups.length, parseInt(options.keep))} backups.`);
    } catch (error) {
      console.error('❌ Automated backup failed:', error);
      process.exit(1);
    }
  });

// Restore backup command
program
  .command('restore <backup-name>')
  .description('Restore database from backup')
  .option('-d, --drop', 'Drop existing collections before restore')
  .option('-c, --collections <collections>', 'Comma-separated list of collections to restore')
  .action(async (backupName, options) => {
    try {
      console.log(`🔄 Starting database restore from: ${backupName}`);
      
      // Confirmation prompt
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise<string>((resolve) => {
        rl.question('⚠️  This will modify your database. Are you sure? (yes/no): ', resolve);
      });
      
      rl.close();
      
      if (answer.toLowerCase() !== 'yes') {
        console.log('❌ Restore cancelled.');
        return;
      }
      
      const { restoreDatabaseBackup } = await import('../src/lib/backup-utils');
      const backupPath = `./backups/${backupName}`;
      
      const restoreOptions: any = {
        dropExisting: options.drop
      };
      
      if (options.collections) {
        restoreOptions.collections = options.collections.split(',').map((c: string) => c.trim());
      }
      
      await restoreDatabaseBackup(backupPath, restoreOptions);
      console.log('✅ Database restore completed successfully!');
    } catch (error) {
      console.error('❌ Restore failed:', error);
      process.exit(1);
    }
  });

// Utility functions
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Parse command line arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}