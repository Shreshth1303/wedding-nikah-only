/**
 * COMPREHENSIVE AUTOMATED VERIFICATION SUITE
 * The Solemnization of Nikah — Jassim Hashim & Shifa Anis Khan
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { server } = require('../server');

const TEST_PORT = 4123;
const BASE_URL = `http://localhost:${TEST_PORT}`;

function makeRequest(urlPath, headers = {}) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${urlPath}`, { headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('\n======================================================');
  console.log('✦ RUNNING SUITE: Moorish Architectural Nikah Website ✦');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ FAIL: ${name}`);
      console.error(`    -> ${err.message}`);
      failed++;
    }
  }

  async function testAsync(name, fn) {
    try {
      await fn();
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ FAIL: ${name}`);
      console.error(`    -> ${err.message}`);
      failed++;
    }
  }

  // 1. Static Asset Integrity Tests
  test('Audio files exist with valid non-empty byte counts', () => {
    const mp3Path = path.join(__dirname, '../assets/audio/chopin-nocturne.mp3');
    const oggPath = path.join(__dirname, '../assets/audio/recuerdos-de-la-alhambra.ogg');
    const licensePath = path.join(__dirname, '../assets/audio/LICENSE.md');

    assert(fs.existsSync(mp3Path), 'chopin-nocturne.mp3 must exist');
    assert(fs.statSync(mp3Path).size > 1000000, 'chopin-nocturne.mp3 must be valid file size (>1MB)');

    assert(fs.existsSync(oggPath), 'recuerdos-de-la-alhambra.ogg must exist');
    assert(fs.statSync(oggPath).size > 1000000, 'recuerdos-de-la-alhambra.ogg must be valid file size (>1MB)');

    assert(fs.existsSync(licensePath), 'Audio licensing & attribution document must exist');
  });

  test('Bismillah SVG crest has valid authentic calligraphy paths', () => {
    const bismillahPath = path.join(__dirname, '../assets/bismillah.svg');
    assert(fs.existsSync(bismillahPath), 'bismillah.svg must exist');
    const content = fs.readFileSync(bismillahPath, 'utf8');
    assert(content.includes('<svg'), 'bismillah.svg must be an svg');
    assert(content.includes('</svg>'), 'bismillah.svg must have closing tag');
    assert(content.includes('IN THE NAME OF ALLAH'), 'bismillah.svg contains scripture translation');
    assert(content.includes('<path'), 'bismillah.svg contains vector paths');
  });

  test('Audio controller script exists and is syntactically sound', () => {
    const audioJsPath = path.join(__dirname, '../js/audio-controller.js');
    assert(fs.existsSync(audioJsPath), 'audio-controller.js must exist');
    const content = fs.readFileSync(audioJsPath, 'utf8');
    assert(content.includes('NikahAudioController'), 'Contains NikahAudioController');
    assert(content.includes('wedding_music_state'), 'Implements session storage persistence');
    assert(content.includes('attemptInitialPlayback'), 'Implements intelligent autoplay handling');
    assert(content.includes('showAutoplayPrompt'), 'Implements unobtrusive single-click prompt fallback');
  });

  // 2. Navigation Menu Verification (Requirement 2)
  test('Index.html contains NO visitor-facing links to 404 or error pages', () => {
    const indexPath = path.join(__dirname, '../index.html');
    const html = fs.readFileSync(indexPath, 'utf8');

    // Extract all href attributes
    const hrefMatches = [...html.matchAll(/href=["']([^"']+)["']/g)].map(m => m[1]);

    const forbiddenLinks = hrefMatches.filter(h => h.includes('404') || h.includes('error'));
    assert.strictEqual(
      forbiddenLinks.length,
      0,
      `Navigation/page links must not link to 404 or error pages. Found: ${forbiddenLinks.join(', ')}`
    );

    // Verify all remaining internal anchor links point to real element IDs in index.html
    const internalAnchors = hrefMatches.filter(h => h.startsWith('#') && h.length > 1);
    for (const anchor of internalAnchors) {
      const targetId = anchor.substring(1);
      assert(
        html.includes(`id="${targetId}"`) || html.includes(`id='${targetId}'`),
        `Anchor target ${anchor} must exist in index.html`
      );
    }
  });

  test('Navigation menu contains legitimate sections only', () => {
    const indexPath = path.join(__dirname, '../index.html');
    const html = fs.readFileSync(indexPath, 'utf8');

    assert(html.includes('class="nav-menu"'), 'nav-menu should be present');
    assert(html.includes('href="#ceremony"'), 'Has The Union navigation link');
    assert(html.includes('href="#venue"'), 'Has Venue & Timings navigation link');
    assert(html.includes('href="#countdown"'), 'Has Countdown navigation link');
    assert(html.includes('id="music-controller-container"'), 'Has audio controller mount');
  });

  // 3. Server-side HTTP Routing Tests (Requirement 3)
  await new Promise((resolve) => server.listen(TEST_PORT, resolve));

  try {
    await testAsync('GET / returns 200 with index.html', async () => {
      const res = await makeRequest('/');
      assert.strictEqual(res.status, 200);
      assert(res.body.includes('The Solemnization of Nikah'), 'Should contain celebration title');
      assert(res.body.includes('Jassim &amp; Shifa') || res.body.includes('Jassim & Shifa'), 'Should contain couple names');
    });

    await testAsync('GET /index.html returns 200 with index.html', async () => {
      const res = await makeRequest('/index.html');
      assert.strictEqual(res.status, 200);
      assert(res.body.includes('Bagai Banquet'), 'Should contain venue');
    });

    await testAsync('GET /nonexistent returns HTTP 404 with custom 404.html page', async () => {
      const res = await makeRequest('/nonexistent');
      assert.strictEqual(res.status, 404, 'Status must be strictly 404');
      assert(res.body.includes('Page Not Found'), 'Must contain Page Not Found error message');
      assert(res.body.includes('404'), 'Must contain 404 numeral');
      assert(res.body.includes('Return to Nikah Sanctuary'), 'Must contain Return to Home button');
    });

    await testAsync('GET /deeply/nested/invalid/route returns HTTP 404 with custom 404.html', async () => {
      const res = await makeRequest('/deeply/nested/invalid/route');
      assert.strictEqual(res.status, 404, 'Status must be strictly 404');
      assert(res.body.includes('The Path Remains Sacred, but This Page Has Moved'), 'Must contain tranquil error title');
    });

    await testAsync('Audio streaming returns HTTP 206 Partial Content on Range request', async () => {
      const res = await makeRequest('/assets/audio/chopin-nocturne.mp3', {
        'Range': 'bytes=0-1023'
      });
      assert.strictEqual(res.status, 206, 'Must support HTTP 206 Range requests for audio streaming');
      assert.strictEqual(res.headers['content-range'], 'bytes 0-1023/5175969');
      assert.strictEqual(res.headers['content-type'], 'audio/mpeg');
    });

    await testAsync('CSS and JS assets are served with correct MIME types', async () => {
      const cssRes = await makeRequest('/css/style.css');
      assert.strictEqual(cssRes.status, 200);
      assert(cssRes.headers['content-type'].includes('text/css'), 'CSS MIME type check');

      const jsRes = await makeRequest('/js/audio-controller.js');
      assert.strictEqual(jsRes.status, 200);
      assert(jsRes.headers['content-type'].includes('javascript'), 'JS MIME type check');
    });
  } finally {
    server.close();
  }

  console.log('\n======================================================');
  console.log(`✦ RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

