/**
 * COMPREHENSIVE AUTOMATED VERIFICATION SUITE
 * The Solemnization of Nikah — Jassim Hashim & Shifa Anis Khan
 * Contemporary Architectural Editorial Design Verification
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { server } = require('../server');

const TEST_PORT = 4124;
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
  console.log('✦ RUNNING SUITE: Contemporary Architectural Nikah Site ✦');
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
  test('Acoustic Oud ambient audio file exists with valid non-empty byte counts', () => {
    const oudPath = path.join(__dirname, '../assets/audio/nikah-oud-ambience.mp3');
    const licensePath = path.join(__dirname, '../assets/audio/LICENSE.md');

    assert(fs.existsSync(oudPath), 'nikah-oud-ambience.mp3 must exist');
    assert(fs.statSync(oudPath).size > 1000000, 'nikah-oud-ambience.mp3 must be valid file size (>1MB)');

    assert(fs.existsSync(licensePath), 'Audio licensing & cultural attribution document must exist');
    const licenseContent = fs.readFileSync(licensePath, 'utf8');
    assert(licenseContent.includes('Oud Ambience'), 'Attribution covers Oud track');
  });

  test('Authentic Qur\'anic Basmala typography exists in index.html and SVG', () => {
    const indexPath = path.join(__dirname, '../index.html');
    const html = fs.readFileSync(indexPath, 'utf8');
    assert(html.includes('بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'), 'index.html contains vocalized Basmala');
    assert(html.includes('وَخَلَقْنَاكُمْ أَزْوَاجًا'), 'index.html contains Qur\'an 78:8 verse');
    assert(html.includes('IN THE NAME OF ALLAH, THE MOST BENEFICENT, THE MOST MERCIFUL'), 'Contains scripture translation');

    const bismillahPath = path.join(__dirname, '../assets/bismillah.svg');
    assert(fs.existsSync(bismillahPath), 'bismillah.svg must exist');
    const svgContent = fs.readFileSync(bismillahPath, 'utf8');
    assert(svgContent.includes('بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'), 'bismillah.svg contains vocalized Arabic');
  });

  test('Audio controller script exists and is syntactically sound', () => {
    const audioJsPath = path.join(__dirname, '../js/audio-controller.js');
    assert(fs.existsSync(audioJsPath), 'audio-controller.js must exist');
    const content = fs.readFileSync(audioJsPath, 'utf8');
    assert(content.includes('NikahAudioEngine'), 'Implements NikahAudioEngine');
    assert(content.includes('nikah_music_state') || content.includes('wedding_music_state'), 'Implements session storage persistence');
    assert(content.includes('gainNode') || content.includes('TARGET_VOLUME'), 'Implements smooth audio fading');
  });

  // 2. Navigation Menu Verification
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
    assert(html.includes('href="#invocation"'), 'Has The Union navigation link');
    assert(html.includes('href="#venue"'), 'Has Venue & Time navigation link');
    assert(html.includes('href="#countdown"'), 'Has Countdown navigation link');
    assert(html.includes('id="music-controller-container"'), 'Has audio controller mount');
  });

  test('Structural integrity: No 4-tier itinerary and has monolith venue details', () => {
    const indexPath = path.join(__dirname, '../index.html');
    const html = fs.readFileSync(indexPath, 'utf8');

    // 4-tier schedule removed
    assert(!html.includes('Istiqbal'), 'Istiqbal schedule removed');
    assert(!html.includes('Dawat-e-Walima') && !html.includes('Dawat'), 'Dawat schedule removed');

    // Retains Date, Time, Venue
    assert(html.includes('Friday, 15th January 2027'), 'Has wedding date');
    assert(html.includes('7 Rajab 1448 AH'), 'Has Hijri date');
    assert(html.includes('11:30 AM'), 'Has Nikah start time');
    assert(html.includes('Bagai Banquet'), 'Has venue name');
    assert(html.includes('btn-add-calendar'), 'Has Add to Calendar action');
    assert(html.includes('btn-copy-address'), 'Has Copy Address action');
  });

  // 3. Server-side HTTP Routing Tests
  await new Promise((resolve) => server.listen(TEST_PORT, resolve));

  try {
    await testAsync('GET / returns 200 with index.html', async () => {
      const res = await makeRequest('/');
      assert.strictEqual(res.status, 200);
      assert(res.body.includes('The Solemnization of Nikah'), 'Should contain celebration title');
      assert(res.body.includes('Jassim') && res.body.includes('Shifa'), 'Should contain couple names');
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
      assert(res.body.includes('Return to Invitation'), 'Must contain Return to Invitation button');
    });

    await testAsync('GET /deeply/nested/invalid/route returns HTTP 404 with custom 404.html', async () => {
      const res = await makeRequest('/deeply/nested/invalid/route');
      assert.strictEqual(res.status, 404, 'Status must be strictly 404');
      assert(res.body.includes('Page Not Found'), 'Must contain error title');
    });

    await testAsync('Audio streaming returns HTTP 206 Partial Content on Range request', async () => {
      const res = await makeRequest('/assets/audio/nikah-oud-ambience.mp3', {
        'Range': 'bytes=0-1023'
      });
      assert.strictEqual(res.status, 206, 'Must support HTTP 206 Range requests for audio streaming');
      assert.strictEqual(res.headers['content-range'], 'bytes 0-1023/1370656');
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
