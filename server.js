/**
 * Production-Ready Static File Server & 404 Route Handler
 * Standard library only (no external dependencies required)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.ics': 'text/calendar; charset=UTF-8',
  '.txt': 'text/plain; charset=UTF-8'
};

function serveFile(req, res, filePath, statusCode = 200) {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return serve404(req, res);
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const totalSize = stats.size;

    // Support HTTP Range requests (crucial for audio streaming and scrubbing)
    const rangeHeader = req.headers.range;
    if (rangeHeader && (ext === '.mp3' || ext === '.ogg' || ext === '.wav')) {
      const parts = rangeHeader.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

      if (start >= totalSize || end >= totalSize) {
        res.writeHead(416, {
          'Content-Range': `bytes */${totalSize}`
        });
        return res.end();
      }

      const chunkSize = (end - start) + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${totalSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600'
      });

      fileStream.pipe(res);
      return;
    }

    const headers = {
      'Content-Type': contentType,
      'Content-Length': totalSize,
      'Accept-Ranges': 'bytes'
    };

    if (ext === '.mp3' || ext === '.ogg') {
      headers['Cache-Control'] = 'public, max-age=3600';
    } else {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      headers['Pragma'] = 'no-cache';
      headers['Expires'] = '0';
    }

    res.writeHead(statusCode, headers);
    fs.createReadStream(filePath).pipe(res);
  });
}

function serve404(req, res) {
  const errorPagePath = path.join(PUBLIC_DIR, '404.html');
  fs.stat(errorPagePath, (err, stats) => {
    if (!err && stats.isFile()) {
      res.writeHead(404, {
        'Content-Type': 'text/html; charset=UTF-8',
        'Content-Length': stats.size,
        'Cache-Control': 'no-cache'
      });
      fs.createReadStream(errorPagePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('404 Not Found');
    }
  });
}

const server = http.createServer((req, res) => {
  // Strip query string and hash
  const urlPath = req.url.split('?')[0].split('#')[0];
  let safePath = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '');

  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const fullPath = path.join(PUBLIC_DIR, safePath);

  // Security check: prevent directory traversal
  if (!fullPath.startsWith(PUBLIC_DIR)) {
    return serve404(req, res);
  }

  fs.stat(fullPath, (err, stats) => {
    if (err) {
      // Check if path without extension matches an existing .html file (clean URLs)
      const htmlPath = fullPath + '.html';
      return fs.stat(htmlPath, (htmlErr, htmlStats) => {
        if (!htmlErr && htmlStats.isFile()) {
          return serveFile(req, res, htmlPath, 200);
        }
        return serve404(req, res);
      });
    }

    if (stats.isDirectory()) {
      const indexPath = path.join(fullPath, 'index.html');
      return fs.stat(indexPath, (indexErr, indexStats) => {
        if (!indexErr && indexStats.isFile()) {
          return serveFile(req, res, indexPath, 200);
        }
        return serve404(req, res);
      });
    }

    if (stats.isFile()) {
      return serveFile(req, res, fullPath, 200);
    }

    return serve404(req, res);
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Nikah Sanctuary Server listening on http://localhost:${PORT}`);
  });
}

module.exports = { server, serveFile, serve404 };

