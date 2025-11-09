// Script to fix Vite build to use standard Vite instead of rolldown-vite
// This prevents React context and module resolution errors during production builds

import { existsSync, mkdirSync, cpSync, rmSync, statSync, readFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = resolve(__dirname, '..');
const viteStandardPath = join(rootDir, 'node_modules', 'vite-standard');
const vitePath = join(rootDir, 'node_modules', 'vite');

// Check if vite-standard exists
if (!existsSync(viteStandardPath)) {
  console.error('❌ vite-standard not found. Please run: npm install vite-standard@npm:vite@^5.4.21 --save-dev');
  process.exit(1);
}

// Backup original vite if it exists and is different from vite-standard
if (existsSync(vitePath)) {
  try {
    const stat = statSync(vitePath);
    if (stat.isDirectory()) {
      // Check if it's already vite-standard by checking package.json
      try {
        const vitePkgPath = join(vitePath, 'package.json');
        if (existsSync(vitePkgPath)) {
          const vitePkg = JSON.parse(readFileSync(vitePkgPath, 'utf-8'));
          // If it's not rolldown-vite, skip replacement
          if (vitePkg.name && !vitePkg.name.includes('rolldown')) {
            console.log('✅ Vite is already using standard Vite, skipping replacement');
            process.exit(0);
          }
        }
      } catch (e) {
        // Continue with replacement
      }
      
      // Remove existing vite
      rmSync(vitePath, { recursive: true, force: true });
      console.log('✅ Removed existing vite directory');
    } else if (stat.isSymbolicLink()) {
      rmSync(vitePath);
      console.log('✅ Removed existing vite symlink');
    }
  } catch (error) {
    console.warn('⚠️  Warning: Could not remove existing vite:', error.message);
  }
}

// Copy vite-standard to vite
try {
  cpSync(viteStandardPath, vitePath, { recursive: true, force: true });
  console.log('✅ Copied vite-standard to node_modules/vite');
  console.log(`   Source: ${viteStandardPath}`);
  console.log(`   Target: ${vitePath}`);
} catch (error) {
  console.error('❌ Error copying vite-standard:', error.message);
  process.exit(1);
}

console.log('✅ Vite is now configured to use standard Vite for production builds');

