// Script to verify that standard Vite is installed (not rolldown-vite)
// This script will fail the build if rolldown-vite is detected

import { existsSync, readFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = resolve(__dirname, '..');
const vitePath = join(rootDir, 'node_modules', 'vite');
const vitePkgPath = join(vitePath, 'package.json');

console.log('🔍 Verifying Vite installation...');
console.log(`   Vite path: ${vitePath}`);

if (!existsSync(vitePath)) {
  console.error('❌ ERROR: Vite not found in node_modules!');
  console.error('   Please run: npm install');
  process.exit(1);
}

if (!existsSync(vitePkgPath)) {
  console.error('❌ ERROR: Vite package.json not found!');
  process.exit(1);
}

try {
  const vitePkg = JSON.parse(readFileSync(vitePkgPath, 'utf-8'));
  console.log(`   Package name: ${vitePkg.name}`);
  console.log(`   Package version: ${vitePkg.version}`);
  
  if (vitePkg.name && vitePkg.name.includes('rolldown')) {
    console.error('❌ ERROR: rolldown-vite is installed instead of standard Vite!');
    console.error('   This will cause build failures with react-router.');
    console.error('   Expected: vite');
    console.error(`   Found: ${vitePkg.name}`);
    console.error('');
    console.error('   Solution:');
    console.error('   1. Delete package-lock.json');
    console.error('   2. Delete node_modules');
    console.error('   3. Run: npm install');
    console.error('   4. Verify package.json has "vite": "^5.4.21" (not rolldown-vite)');
    process.exit(1);
  }
  
  if (vitePkg.name !== 'vite') {
    console.warn('⚠️  WARNING: Unexpected Vite package name:', vitePkg.name);
    console.warn('   Expected: vite');
  }
  
  console.log('✅ Verified: Standard Vite is installed');
  console.log(`   Version: ${vitePkg.version}`);
} catch (error) {
  console.error('❌ ERROR: Could not read Vite package.json:', error.message);
  process.exit(1);
}

