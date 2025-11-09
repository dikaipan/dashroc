// Script to fix Vitest to use standard Vite instead of rolldown-vite
// This prevents __vite_ssr_exportName__ errors during testing

import { existsSync, mkdirSync, cpSync, rmSync, readdirSync, statSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = resolve(__dirname, '..');
const viteStandardPath = join(rootDir, 'node_modules', 'vite-standard');
const vitestVitePath = join(rootDir, 'node_modules', 'vitest', 'node_modules', 'vite');
const vitestNodeModulesPath = join(rootDir, 'node_modules', 'vitest', 'node_modules');

// Check if vite-standard exists
if (!existsSync(viteStandardPath)) {
  console.error('❌ vite-standard not found. Please run: npm install vite-standard@npm:vite@5.4.11 --save-dev');
  process.exit(1);
}

// Create vitest/node_modules if it doesn't exist
if (!existsSync(vitestNodeModulesPath)) {
  mkdirSync(vitestNodeModulesPath, { recursive: true });
}

// Remove existing vite in vitest/node_modules
if (existsSync(vitestVitePath)) {
  try {
    const stat = statSync(vitestVitePath);
    if (stat.isDirectory()) {
      rmSync(vitestVitePath, { recursive: true, force: true });
      console.log('✅ Removed existing vite directory');
    } else if (stat.isSymbolicLink()) {
      rmSync(vitestVitePath);
      console.log('✅ Removed existing vite symlink');
    }
  } catch (error) {
    console.warn('⚠️  Warning: Could not remove existing vite:', error.message);
  }
}

// Copy vite-standard to vitest/node_modules/vite
try {
  cpSync(viteStandardPath, vitestVitePath, { recursive: true, force: true });
  console.log('✅ Copied vite-standard to vitest/node_modules/vite');
  console.log(`   Source: ${viteStandardPath}`);
  console.log(`   Target: ${vitestVitePath}`);
} catch (error) {
  console.error('❌ Error copying vite-standard:', error.message);
  process.exit(1);
}

console.log('✅ Vitest is now configured to use standard Vite for testing');
