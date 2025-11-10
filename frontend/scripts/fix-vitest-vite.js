// Script to fix Vitest to use standard Vite instead of rolldown-vite
// This prevents __vite_ssr_exportName__ errors during testing
// NOTE: This script is now optional since we're using standard Vite directly

import { existsSync, mkdirSync, cpSync, rmSync, statSync, readFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = resolve(__dirname, '..');
const vitePath = join(rootDir, 'node_modules', 'vite');
const vitestVitePath = join(rootDir, 'node_modules', 'vitest', 'node_modules', 'vite');
const vitestNodeModulesPath = join(rootDir, 'node_modules', 'vitest', 'node_modules');

console.log('🔧 Checking Vitest Vite configuration...');

// Check if main vite exists and is standard vite (not rolldown-vite)
if (!existsSync(vitePath)) {
  console.warn('⚠️  Vite not found in node_modules. Skipping Vitest fix.');
  process.exit(0);
}

// Check if it's standard vite
try {
  const vitePkgPath = join(vitePath, 'package.json');
  if (existsSync(vitePkgPath)) {
    const vitePkg = JSON.parse(readFileSync(vitePkgPath, 'utf-8'));
    if (vitePkg.name && vitePkg.name.includes('rolldown')) {
      console.warn('⚠️  Detected rolldown-vite. Vitest may have issues. Consider using standard Vite.');
      process.exit(0);
    }
    console.log(`✅ Using standard Vite: ${vitePkg.name}@${vitePkg.version}`);
  }
} catch (e) {
  console.warn('⚠️  Could not read vite package.json:', e.message);
}

// Create vitest/node_modules if it doesn't exist
if (!existsSync(vitestNodeModulesPath)) {
  try {
    mkdirSync(vitestNodeModulesPath, { recursive: true });
  } catch (error) {
    console.warn('⚠️  Could not create vitest/node_modules:', error.message);
    process.exit(0);
  }
}

// Check if vitest has its own vite installation
if (existsSync(vitestVitePath)) {
  try {
    const stat = statSync(vitestVitePath);
    if (stat.isDirectory()) {
      // Check if it's rolldown-vite
      const vitestVitePkgPath = join(vitestVitePath, 'package.json');
      if (existsSync(vitestVitePkgPath)) {
        const vitestVitePkg = JSON.parse(readFileSync(vitestVitePkgPath, 'utf-8'));
        if (vitestVitePkg.name && !vitestVitePkg.name.includes('rolldown')) {
          console.log('✅ Vitest is already using standard Vite');
          process.exit(0);
        }
        console.log('⚠️  Vitest is using rolldown-vite, replacing with standard Vite...');
      }
      
      rmSync(vitestVitePath, { recursive: true, force: true });
      console.log('✅ Removed existing vite directory from vitest');
    } else if (stat.isSymbolicLink()) {
      rmSync(vitestVitePath);
      console.log('✅ Removed existing vite symlink from vitest');
    }
  } catch (error) {
    console.warn('⚠️  Warning: Could not remove existing vite from vitest:', error.message);
  }
}

// Copy standard vite to vitest/node_modules/vite
try {
  cpSync(vitePath, vitestVitePath, { recursive: true, force: true });
  console.log('✅ Copied standard Vite to vitest/node_modules/vite');
  console.log(`   Source: ${vitePath}`);
  console.log(`   Target: ${vitestVitePath}`);
} catch (error) {
  console.warn('⚠️  Warning: Could not copy vite to vitest:', error.message);
  console.log('   Vitest will use its own vite installation');
  process.exit(0);
}

console.log('✅ Vitest is now configured to use standard Vite for testing');
