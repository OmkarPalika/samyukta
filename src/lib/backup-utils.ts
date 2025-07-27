/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Db } from 'mongodb';
import { getDbPromise } from './mongodb';
import * as fs from 'fs/promises';
import * as path from 'path';
import { createWriteStream, createReadStream } from 'fs';
import { pipeline } from 'stream/promises';
import { createGzip, createGunzip } from 'zlib';

// Backup configuration
interface BackupConfig {
  outputDir: string;
  includeCollections?: string[];
  excludeCollections?: string[];
  compress?: boolean;
  maxBackups?: number;
}

interface BackupMetadata {
  timestamp: string;
  collections: string[];
  totalDocuments: number;
  size: number;
  version: string;
}

// Default backup configuration
const DEFAULT_CONFIG: BackupConfig = {
  outputDir: './backups',
  compress: true,
  maxBackups: 10,
};

export class DatabaseBackupManager {
  private config: BackupConfig;
  private db: Db | null = null;

  constructor(config: Partial<BackupConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  private async getDb(): Promise<Db> {
    if (!this.db) {
      this.db = await getDbPromise();
    }
    return this.db;
  }

  /**
   * Create a full database backup
   */
  async createBackup(name?: string): Promise<string> {
    const db = await this.getDb();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = name || `samyukta-backup-${timestamp}`;
    const backupDir = path.join(this.config.outputDir, backupName);

    try {
      // Ensure backup directory exists
      await fs.mkdir(backupDir, { recursive: true });

      // Get all collections
      const collections = await db.listCollections().toArray();
      const collectionNames = collections
        .map(c => c.name)
        .filter(name => this.shouldBackupCollection(name));

      console.log(`Starting backup of ${collectionNames.length} collections...`);

      const metadata: BackupMetadata = {
        timestamp: new Date().toISOString(),
        collections: collectionNames,
        totalDocuments: 0,
        size: 0,
        version: '1.0.0'
      };

      // Backup each collection
      for (const collectionName of collectionNames) {
        const collection = db.collection(collectionName);
        const documents = await collection.find({}).toArray();
        
        metadata.totalDocuments += documents.length;

        const fileName = `${collectionName}.json`;
        const filePath = path.join(backupDir, fileName);

        if (this.config.compress) {
          await this.writeCompressedFile(filePath + '.gz', documents);
        } else {
          await fs.writeFile(filePath, JSON.stringify(documents, null, 2));
        }

        console.log(`✓ Backed up ${collectionName}: ${documents.length} documents`);
      }

      // Write metadata
      await fs.writeFile(
        path.join(backupDir, 'metadata.json'),
        JSON.stringify(metadata, null, 2)
      );

      // Calculate total backup size
      const stats = await this.getDirectorySize(backupDir);
      metadata.size = stats;

      // Update metadata with size
      await fs.writeFile(
        path.join(backupDir, 'metadata.json'),
        JSON.stringify(metadata, null, 2)
      );

      console.log(`✅ Backup completed: ${backupName}`);
      console.log(`📁 Location: ${backupDir}`);
      console.log(`📊 Total documents: ${metadata.totalDocuments}`);
      console.log(`💾 Size: ${this.formatBytes(metadata.size)}`);

      // Clean up old backups
      await this.cleanupOldBackups();

      return backupDir;
    } catch (error) {
      console.error('❌ Backup failed:', error);
      throw error;
    }
  }

  /**
   * Restore database from backup
   */
  async restoreBackup(backupPath: string, options: {
    dropExisting?: boolean;
    collections?: string[];
  } = {}): Promise<void> {
    const db = await this.getDb();
    
    try {
      // Read metadata
      const metadataPath = path.join(backupPath, 'metadata.json');
      const metadataContent = await fs.readFile(metadataPath, 'utf-8');
      const metadata: BackupMetadata = JSON.parse(metadataContent);

      console.log(`Starting restore from backup: ${path.basename(backupPath)}`);
      console.log(`📅 Created: ${metadata.timestamp}`);
      console.log(`📊 Collections: ${metadata.collections.length}`);

      const collectionsToRestore = options.collections || metadata.collections;

      for (const collectionName of collectionsToRestore) {
        if (!metadata.collections.includes(collectionName)) {
          console.warn(`⚠️ Collection ${collectionName} not found in backup`);
          continue;
        }

        const collection = db.collection(collectionName);

        // Drop existing collection if requested
        if (options.dropExisting) {
          try {
            await collection.drop();
            console.log(`🗑️ Dropped existing collection: ${collectionName}`);
          } catch (error) {
            // Collection might not exist, ignore error
          }
        }

        // Read backup data
        const fileName = `${collectionName}.json`;
        const filePath = path.join(backupPath, fileName);
        const compressedPath = filePath + '.gz';

        let documents: any[];

        if (await this.fileExists(compressedPath)) {
          documents = await this.readCompressedFile(compressedPath);
        } else if (await this.fileExists(filePath)) {
          const content = await fs.readFile(filePath, 'utf-8');
          documents = JSON.parse(content);
        } else {
          console.warn(`⚠️ Backup file not found for collection: ${collectionName}`);
          continue;
        }

        // Insert documents
        if (documents.length > 0) {
          await collection.insertMany(documents);
          console.log(`✓ Restored ${collectionName}: ${documents.length} documents`);
        } else {
          console.log(`ℹ️ No documents to restore for ${collectionName}`);
        }
      }

      console.log('✅ Restore completed successfully');
    } catch (error) {
      console.error('❌ Restore failed:', error);
      throw error;
    }
  }

  /**
   * Export data to various formats
   */
  async exportData(format: 'json' | 'csv' | 'xlsx', options: {
    collections?: string[];
    outputPath?: string;
    query?: object;
  } = {}): Promise<string> {
    const db = await this.getDb();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputPath = options.outputPath || `./exports/samyukta-export-${timestamp}`;

    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    const collections = options.collections || await this.getAllCollectionNames();

    switch (format) {
      case 'json':
        return await this.exportToJSON(collections, outputPath, options.query);
      case 'csv':
        return await this.exportToCSV(collections, outputPath, options.query);
      case 'xlsx':
        return await this.exportToXLSX(collections, outputPath, options.query);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * List available backups
   */
  async listBackups(): Promise<Array<{
    name: string;
    path: string;
    metadata: BackupMetadata;
    size: number;
  }>> {
    try {
      const backupDir = this.config.outputDir;
      const entries = await fs.readdir(backupDir, { withFileTypes: true });
      const backups = [];

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const backupPath = path.join(backupDir, entry.name);
          const metadataPath = path.join(backupPath, 'metadata.json');

          if (await this.fileExists(metadataPath)) {
            const metadataContent = await fs.readFile(metadataPath, 'utf-8');
            const metadata = JSON.parse(metadataContent);
            const size = await this.getDirectorySize(backupPath);

            backups.push({
              name: entry.name,
              path: backupPath,
              metadata,
              size
            });
          }
        }
      }

      return backups.sort((a, b) => 
        new Date(b.metadata.timestamp).getTime() - new Date(a.metadata.timestamp).getTime()
      );
    } catch (error) {
      console.error('Error listing backups:', error);
      return [];
    }
  }

  /**
   * Delete a backup
   */
  async deleteBackup(backupName: string): Promise<void> {
    const backupPath = path.join(this.config.outputDir, backupName);
    
    if (await this.fileExists(backupPath)) {
      await fs.rm(backupPath, { recursive: true, force: true });
      console.log(`🗑️ Deleted backup: ${backupName}`);
    } else {
      throw new Error(`Backup not found: ${backupName}`);
    }
  }

  // Private helper methods
  private shouldBackupCollection(name: string): boolean {
    if (this.config.includeCollections) {
      return this.config.includeCollections.includes(name);
    }
    
    if (this.config.excludeCollections) {
      return !this.config.excludeCollections.includes(name);
    }

    // Skip system collections
    return !name.startsWith('system.');
  }

  private async writeCompressedFile(filePath: string, data: any[]): Promise<void> {
    const writeStream = createWriteStream(filePath);
    const gzipStream = createGzip();
    
    await pipeline(
      async function* () {
        yield JSON.stringify(data, null, 2);
      },
      gzipStream,
      writeStream
    );
  }

  private async readCompressedFile(filePath: string): Promise<any[]> {
    const readStream = createReadStream(filePath);
    const gunzipStream = createGunzip();
    
    let content = '';
    
    await pipeline(
      readStream,
      gunzipStream,
      async function* (source) {
        for await (const chunk of source) {
          content += chunk.toString();
        }
      }
    );

    return JSON.parse(content);
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private async getDirectorySize(dirPath: string): Promise<number> {
    let totalSize = 0;
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        totalSize += await this.getDirectorySize(fullPath);
      } else {
        const stats = await fs.stat(fullPath);
        totalSize += stats.size;
      }
    }

    return totalSize;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private async getAllCollectionNames(): Promise<string[]> {
    const db = await this.getDb();
    const collections = await db.listCollections().toArray();
    return collections.map(c => c.name).filter(name => this.shouldBackupCollection(name));
  }

  private async exportToJSON(collections: string[], outputPath: string, query?: object): Promise<string> {
    const db = await this.getDb();
    const exportData: Record<string, any[]> = {};

    for (const collectionName of collections) {
      const collection = db.collection(collectionName);
      const documents = await collection.find(query || {}).toArray();
      exportData[collectionName] = documents;
    }

    const filePath = outputPath + '.json';
    await fs.writeFile(filePath, JSON.stringify(exportData, null, 2));
    
    console.log(`✅ Exported to JSON: ${filePath}`);
    return filePath;
  }

  private async exportToCSV(collections: string[], outputPath: string, query?: object): Promise<string> {
    const db = await this.getDb();
    const outputDir = outputPath + '-csv';
    await fs.mkdir(outputDir, { recursive: true });

    for (const collectionName of collections) {
      const collection = db.collection(collectionName);
      const documents = await collection.find(query || {}).toArray();
      
      if (documents.length > 0) {
        const csv = this.convertToCSV(documents);
        const filePath = path.join(outputDir, `${collectionName}.csv`);
        await fs.writeFile(filePath, csv);
      }
    }

    console.log(`✅ Exported to CSV: ${outputDir}`);
    return outputDir;
  }

  private async exportToXLSX(collections: string[], outputPath: string, query?: object): Promise<string> {
    // This would require the 'xlsx' package
    // For now, export as JSON with .xlsx extension as placeholder
    return await this.exportToJSON(collections, outputPath + '.xlsx', query);
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';

    // Get all unique keys
    const keys = Array.from(new Set(data.flatMap(obj => Object.keys(obj))));
    
    // Create header
    const header = keys.join(',');
    
    // Create rows
    const rows = data.map(obj => 
      keys.map(key => {
        const value = obj[key];
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value).replace(/"/g, '""');
      }).map(field => `"${field}"`).join(',')
    );

    return [header, ...rows].join('\n');
  }

  private async cleanupOldBackups(): Promise<void> {
    if (!this.config.maxBackups || this.config.maxBackups <= 0) return;

    const backups = await this.listBackups();
    
    if (backups.length > this.config.maxBackups) {
      const backupsToDelete = backups.slice(this.config.maxBackups);
      
      for (const backup of backupsToDelete) {
        await this.deleteBackup(backup.name);
      }
      
      console.log(`🧹 Cleaned up ${backupsToDelete.length} old backups`);
    }
  }
}

// Singleton instance
export const backupManager = new DatabaseBackupManager();

// Utility functions
export async function createDatabaseBackup(name?: string): Promise<string> {
  return await backupManager.createBackup(name);
}

export async function restoreDatabaseBackup(backupPath: string, options?: {
  dropExisting?: boolean;
  collections?: string[];
}): Promise<void> {
  return await backupManager.restoreBackup(backupPath, options);
}

export async function exportDatabaseData(
  format: 'json' | 'csv' | 'xlsx',
  options?: {
    collections?: string[];
    outputPath?: string;
    query?: object;
  }
): Promise<string> {
  return await backupManager.exportData(format, options);
}

export async function listDatabaseBackups() {
  return await backupManager.listBackups();
}

export async function deleteDatabaseBackup(backupName: string): Promise<void> {
  return await backupManager.deleteBackup(backupName);
}