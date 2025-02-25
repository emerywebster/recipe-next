#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directories to check for references to src/
const dirsToCheck = ['app', 'pages', 'components', 'lib', 'styles', 'public'];

// Files to check for references to src/
const filesToCheck = [
  'next.config.js',
  'tsconfig.json',
  'package.json',
  'tailwind.config.js',
  '.eslintrc.js',
  '.eslintrc.json',
  'README.md',
];

// Create backup directory
const backupDir = path.join(__dirname, '../src-backup');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// Backup src directory
console.log('Creating backup of src directory...');
execSync(`cp -r ${path.join(__dirname, '../src')} ${backupDir}`);
console.log('Backup created at', backupDir);

// Check for references to src/
console.log('\nChecking for references to src/ directory...');
let referencesFound = false;

// Function to check a file for src/ references
function checkFileForSrcReferences(filePath) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  const srcReferences = content.match(/['"](src\/|@\/src\/|\.\.\/src\/|\.\/src\/)/g);

  if (srcReferences && srcReferences.length > 0) {
    console.log(`Found references in ${filePath}:`);
    srcReferences.forEach((ref) => console.log(`  - ${ref}`));
    referencesFound = true;
  }
}

// Check specified files
filesToCheck.forEach((file) => {
  const filePath = path.join(__dirname, '..', file);
  checkFileForSrcReferences(filePath);
});

// Recursively check directories
function checkDirForSrcReferences(dirPath) {
  if (!fs.existsSync(dirPath)) return;

  const items = fs.readdirSync(dirPath);

  items.forEach((item) => {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      // Skip node_modules and .next
      if (item !== 'node_modules' && item !== '.next' && item !== 'src' && item !== 'src-backup') {
        checkDirForSrcReferences(itemPath);
      }
    } else if (
      stats.isFile() &&
      (itemPath.endsWith('.js') ||
        itemPath.endsWith('.jsx') ||
        itemPath.endsWith('.ts') ||
        itemPath.endsWith('.tsx') ||
        itemPath.endsWith('.json'))
    ) {
      checkFileForSrcReferences(itemPath);
    }
  });
}

dirsToCheck.forEach((dir) => {
  const dirPath = path.join(__dirname, '..', dir);
  checkDirForSrcReferences(dirPath);
});

// Provide guidance based on results
if (referencesFound) {
  console.log('\n⚠️ References to src/ directory found!');
  console.log(
    'Please update these references to use the new app/ directory structure before removing the src/ directory.'
  );
  console.log('Common patterns to replace:');
  console.log('  - src/ → app/');
  console.log('  - @/src/ → @/app/');
} else {
  console.log('\n✅ No references to src/ directory found!');
  console.log('It should be safe to remove the src/ directory.');
  console.log('\nTo remove the src/ directory, run:');
  console.log('  rm -rf src');
  console.log('\nIf you encounter any issues, you can restore from the backup:');
  console.log('  cp -r src-backup/src .');
}

console.log('\nMigration cleanup check complete!');
