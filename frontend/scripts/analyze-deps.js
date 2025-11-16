/**
 * Script untuk menganalisis ukuran dependencies di node_modules
 * Menampilkan dependencies terbesar dan rekomendasi optimasi
 */

import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nodeModulesPath = join(__dirname, '..', 'node_modules');

async function getDirSize(dirPath) {
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    let totalSize = 0;

    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      try {
        const stats = await stat(fullPath);
        
        if (entry.isDirectory()) {
          // Skip beberapa direktori yang tidak perlu dihitung
          if (entry.name === '.bin' || entry.name === '.cache') {
            continue;
          }
          totalSize += await getDirSize(fullPath);
        } else {
          totalSize += stats.size;
        }
      } catch (err) {
        // Skip files/dirs yang tidak bisa diakses
        continue;
      }
    }

    return totalSize;
  } catch (err) {
    return 0;
  }
}

async function analyzeDependencies() {
  console.log('🔍 Analyzing node_modules size...\n');

  try {
    const entries = await readdir(nodeModulesPath, { withFileTypes: true });
    const packageSizes = [];

    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        const packagePath = join(nodeModulesPath, entry.name);
        const size = await getDirSize(packagePath);
        
        if (size > 0) {
          packageSizes.push({
            name: entry.name,
            size: size,
            sizeMB: (size / (1024 * 1024)).toFixed(2)
          });
        }
      }
    }

    // Sort by size (largest first)
    packageSizes.sort((a, b) => b.size - a.size);

    // Calculate total size
    const totalSize = packageSizes.reduce((sum, pkg) => sum + pkg.size, 0);
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

    console.log(`📦 Total node_modules size: ${totalSizeMB} MB\n`);
    console.log('📊 Top 20 Largest Dependencies:\n');
    console.log('Package Name'.padEnd(50) + 'Size (MB)');
    console.log('-'.repeat(70));

    packageSizes.slice(0, 20).forEach((pkg, index) => {
      console.log(`${(index + 1).toString().padStart(2)}. ${pkg.name.padEnd(47)}${pkg.sizeMB.padStart(8)} MB`);
    });

    console.log('\n💡 Recommendations:');
    console.log('1. Dependencies yang besar (>50MB) mungkin bisa dioptimasi');
    console.log('2. Gunakan "npm install --no-optional" untuk skip optional dependencies');
    console.log('3. Pertimbangkan menggunakan lighter alternatives');
    console.log('4. Gunakan "npm run install:minimal" untuk instalasi minimal');
    console.log('5. Hapus node_modules dan package-lock.json, lalu install ulang dengan --no-optional');

    // Check for optional dependencies
    try {
      const { readFile } = await import('fs/promises');
      const packageJsonPath = join(__dirname, '..', 'package.json');
      const packageJsonContent = await readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);
      
      if (packageJson.optionalDependencies && Object.keys(packageJson.optionalDependencies).length > 0) {
        console.log('\n⚠️  Optional Dependencies (tidak akan diinstall dengan --no-optional):');
        Object.keys(packageJson.optionalDependencies).forEach(dep => {
          console.log(`   - ${dep}`);
        });
        console.log('\n   Install manual jika diperlukan:');
        Object.keys(packageJson.optionalDependencies).forEach(dep => {
          console.log(`   npm install ${dep} --save-optional`);
        });
      }
    } catch (err) {
      // Skip if package.json cannot be read
    }

  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('❌ node_modules tidak ditemukan. Jalankan "npm install" terlebih dahulu.');
    } else {
      console.error('❌ Error:', err.message);
    }
    process.exit(1);
  }
}

analyzeDependencies();

