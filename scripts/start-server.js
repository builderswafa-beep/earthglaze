const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const nextDir = path.join(rootDir, '.next');
const nextBin = path.join(rootDir, 'node_modules', 'next', 'dist', 'bin', 'next');

// Check if production build exists and is complete
const buildIdFile = path.join(nextDir, 'BUILD_ID');
const isBuildReady = fs.existsSync(nextDir) && fs.existsSync(buildIdFile);

if (!isBuildReady) {
  console.log('[EarthGlaze] Production build (.next) is missing. Automatically generating build...');
  try {
    execSync(`node "${nextBin}" build`, {
      cwd: rootDir,
      stdio: 'inherit',
      env: process.env,
    });
    console.log('[EarthGlaze] Production build completed successfully.');
  } catch (err) {
    console.error('[EarthGlaze] Production build failed:', err);
    process.exit(1);
  }
}

// Start Next.js production server
const port = process.env.PORT || '3000';
console.log(`[EarthGlaze] Starting Next.js production server on port ${port}...`);

const child = spawn(process.execPath, [nextBin, 'start', '-p', port], {
  cwd: rootDir,
  stdio: 'inherit',
  env: process.env,
});

child.on('error', (err) => {
  console.error('[EarthGlaze] Failed to start server process:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});

process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
