/**
 * Script untuk menghapus dependencies besar yang tidak diperlukan untuk build production
 * Dependencies yang dihapus:
 * - netlify-cli (~200 MB) - Hanya diperlukan untuk Netlify deployment lokal
 * - @vitest/ui (~50-100 MB) - Hanya diperlukan untuk testing dengan UI
 * 
 * Catatan: Dependencies ini tetap ada di package.json, hanya folder di node_modules yang dihapus
 * Untuk restore, jalankan: npm install netlify-cli @vitest/ui --save-dev
 */

import { existsSync, rmSync, readdirSync, lstatSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = resolve(__dirname, '..');
const nodeModulesPath = join(rootDir, 'node_modules');

/**
 * Calculate directory size recursively
 */
function calculateDirSize(dirPath) {
  let size = 0;
  
  try {
    const items = readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = join(dirPath, item);
      
      try {
        const stats = lstatSync(itemPath);
        
        if (stats.isDirectory()) {
          // Skip some directories that might cause issues
          if (item === '.bin' || item === '.cache' || item.startsWith('.')) {
            continue;
          }
          size += calculateDirSize(itemPath);
        } else if (stats.isFile()) {
          size += stats.size;
        }
      } catch (err) {
        // Skip files/dirs that can't be accessed
        continue;
      }
    }
  } catch (err) {
    // Skip if directory can't be read
  }
  
  return size;
}

// Dependencies besar yang akan dihapus (opsional, tidak diperlukan untuk build)
const largeDepsToRemove = [
  'netlify-cli',      // ~200 MB - Hanya untuk Netlify deployment lokal
  '@vitest/ui'        // ~50-100 MB - Hanya untuk testing dengan UI
];

console.log('🗑️  Removing large optional dependencies...');
console.log(`   Root dir: ${rootDir}`);
console.log(`   Node modules: ${nodeModulesPath}\n`);

let totalRemoved = 0;
let totalSize = 0;

for (const dep of largeDepsToRemove) {
  const depPath = join(nodeModulesPath, dep);
  
  if (existsSync(depPath)) {
    try {
      // Calculate size before removal
      const size = calculateDirSize(depPath);
      const sizeMB = (size / (1024 * 1024)).toFixed(2);
      
      // Remove the directory
      rmSync(depPath, { recursive: true, force: true });
      console.log(`✅ Removed ${dep} (${sizeMB} MB)`);
      totalRemoved++;
      totalSize += size;
    } catch (error) {
      console.warn(`⚠️  Could not remove ${dep}:`, error.message);
    }
  } else {
    console.log(`ℹ️  ${dep} not found (already removed or not installed)`);
  }
}

if (totalRemoved > 0) {
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  console.log(`\n✅ Removed ${totalRemoved} dependencies (${totalSizeMB} MB total)`);
  console.log('\n📝 Note:');
  console.log('   - Dependencies are still in package.json');
  console.log('   - They will be reinstalled on next "npm install"');
  console.log('   - To restore manually: npm install netlify-cli @vitest/ui --save-dev');
  console.log('   - Build and dev server will work without these dependencies');
} else {
  console.log('\nℹ️  No large dependencies to remove');
}

console.log('\n💡 Usage:');
console.log('   - Build: npm run build (works without these deps)');
console.log('   - Dev: npm run dev (works without these deps)');
console.log('   - Test: npm run test (works without @vitest/ui)');
console.log('   - Test UI: npm run test:ui (requires @vitest/ui - will fail if removed)');
console.log('   - Netlify: npm run netlify:dev (requires netlify-cli - will fail if removed)');

