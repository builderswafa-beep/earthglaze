// EarthGlaze Production Standalone Server
// Designed for containerized & shared environments (LiteSpeed / Enhance / cPanel)
// Avoids nested process spawning (EAGAIN) and directly boots Next.js in a single process.

const http = require('http');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname);
const port = parseInt(process.env.PORT, 10) || 3000;

// 1. Sanitize required-server-files.json if needed (Linux path normalization)
const reqServerFilesPath = path.join(rootDir, '.next', 'required-server-files.json');
if (fs.existsSync(reqServerFilesPath)) {
  try {
    const raw = fs.readFileSync(reqServerFilesPath, 'utf8');
    const parsed = JSON.parse(raw);
    let modified = false;

    if (Array.isArray(parsed.files)) {
      const fixedFiles = parsed.files.map(f => {
        if (typeof f === 'string' && f.includes('\\')) {
          modified = true;
          return f.replace(/\\+/g, '/');
        }
        return f;
      });
      if (modified) parsed.files = fixedFiles;
    }

    if (parsed.appDir !== rootDir && parsed.appDir !== '.') {
      parsed.appDir = rootDir;
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(reqServerFilesPath, JSON.stringify(parsed, null, 2), 'utf8');
      console.log('[EarthGlaze Server] Normalized .next/required-server-files.json paths for Linux');
    }
  } catch (e) {
    console.warn('[EarthGlaze Server] Warning during required-server-files check:', e.message);
  }
}

// 2. Verify build directory
const buildIdPath = path.join(rootDir, '.next', 'BUILD_ID');
if (!fs.existsSync(buildIdPath)) {
  console.error('[EarthGlaze Server] CRITICAL: .next/BUILD_ID not found in ' + rootDir);
  console.error('[EarthGlaze Server] Please ensure git pull completed or run next build.');
  process.exit(1);
}

// 3. Initialize Next.js in-process (Single Process, 0 worker forks, immune to EAGAIN)
const next = require('next');
const app = next({ dev: false, dir: rootDir });
const handle = app.getRequestHandler();

console.log('[EarthGlaze Server] Preparing Next.js production app...');

app.prepare()
  .then(() => {
    const server = http.createServer((req, res) => {
      const host = (req.headers['x-forwarded-host'] || req.headers.host || '').toLowerCase().split(':')[0];
      // Automatically redirect non-www earthglazebeauty.com to www.earthglazebeauty.com
      if (host === 'earthglazebeauty.com') {
        const targetUrl = `https://www.earthglazebeauty.com${req.url || '/'}`;
        res.writeHead(301, {
          Location: targetUrl,
          'Content-Type': 'text/plain',
        });
        return res.end(`Redirecting to ${targetUrl}`);
      }

      handle(req, res);
    });

    server.listen(port, '0.0.0.0', (err) => {
      if (err) {
        console.error('[EarthGlaze Server] Listen error:', err);
        process.exit(1);
      }
      console.log(`[EarthGlaze Server] Ready! Listening on http://0.0.0.0:${port}`);
    });

    const shutdown = (signal) => {
      console.log(`[EarthGlaze Server] Received ${signal}, closing server...`);
      server.close(() => {
        console.log('[EarthGlaze Server] Server closed gracefully.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  })
  .catch((err) => {
    console.error('[EarthGlaze Server] Preparation failed:', err);
    process.exit(1);
  });
