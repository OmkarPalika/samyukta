#!/usr/bin/env node

/**
 * Script to automatically update service worker cache version
 * This ensures that the PWA update notification shows when redeploying
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SW_PATH = path.join(__dirname, '..', 'public', 'sw.js');

function updateServiceWorkerVersion() {
  try {
    // Read the service worker file
    let swContent = fs.readFileSync(SW_PATH, 'utf8');
    
    // Generate new version based on current timestamp
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    
    const newVersion = `${year}-${month}-${day}-${hour}${minute}`;
    
    // Update the cache version in the service worker
    const versionRegex = /const CACHE_VERSION = '[^']+';/;
    const newVersionLine = `const CACHE_VERSION = '${newVersion}';`;
    
    if (versionRegex.test(swContent)) {
      swContent = swContent.replace(versionRegex, newVersionLine);
      
      // Write the updated content back
      fs.writeFileSync(SW_PATH, swContent, 'utf8');
      
      console.log(`✅ Service Worker cache version updated to: ${newVersion}`);
      console.log(`📁 Updated file: ${SW_PATH}`);
    } else {
      console.error('❌ Could not find CACHE_VERSION in service worker file');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Error updating service worker version:', error.message);
    process.exit(1);
  }
}

// Run the update
updateServiceWorkerVersion();