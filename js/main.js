/**
 * THE SOLEMNIZATION OF NIKAH — JASSIM HASHIM & SHIFA ANIS KHAN
 * Luxury Contemporary Architectural Interaction Suite
 * 
 * Features:
 * - Bespoke 3D Royal Wax Seal Envelope Opening Experience
 * - 60fps Floating Golden Dust Ambient Canvas
 * - Live Architectural Chronometer (Countdown)
 * - Interactive Digital Du'a & Blessing Wall with Persistent Storage
 * - Dynamic .ics Calendar Generator for Jan 15, 2027 at 7:00 PM IST
 * - Venue Address Clipboard with Real-Time Micro-Toast
 * - Archival Keepsake Print Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientGoldParticles();
  initEnvelopeCeremony();
  initLiveCountdown();
  initCalendarDownload();
  initAddressClipboard();
  initBlessingsWall();
  initPrintTrigger();
});

/* ==========================================================================
   1. FLOATING GOLDEN DUST AMBIENT CANVAS (60FPS)
   ========================================================================== */
function initAmbientGoldParticles() {
  const canvas = document.getElementById('ambient-gold-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(38, Math.floor(width / 32));
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: -Math.random() * 0.45 - 0.15,
      alpha: Math.random() * 0.55 + 0.15,
      fadeSpeed: Math.random() * 0.008 + 0.003,
      fadeDirection: Math.random() > 0.5 ? 1 : -1
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.speedX;
      p.y += p.speedY;
      p.alpha += p.fadeSpeed * p.fadeDirection;

      if (p.alpha <= 0.08) {
        p.alpha = 0.08;
        p.fadeDirection = 1;
      } else if (p.alpha >= 0.7) {
        p.alpha = 0.7;
        p.fadeDirection = -1;
      }

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      // Draw soft glowing gold dust mote
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 142, 85, ${p.alpha})`;
      ctx.shadowBlur = p.radius * 3;
      ctx.shadowColor = 'rgba(218, 175, 110, 0.45)';
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. BESPOKE ROYAL WAX SEAL ENVELOPE OPENING CEREMONY
   ========================================================================== */
function initEnvelopeCeremony() {
  const overlay = document.getElementById('envelope-ceremony-overlay');
  const sealBtn = document.getElementById('btn-open-seal');
  const skipBtn = document.getElementById('btn-skip-envelope');
  if (!overlay || !sealBtn) return;

  const STORAGE_KEY = 'nikah_envelope_opened';

  // Check if previously opened in this session
  if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
    overlay.classList.add('is-opened');
    overlay.style.display = 'none';
    return;
  }

  function openEnvelope(triggerAudio = true) {
    overlay.classList.add('is-opening');

    if (triggerAudio && window.__NIKAH_AUDIO_ENGINE__) {
      window.__NIKAH_AUDIO_ENGINE__.unlockAndPlay();
    }

    setTimeout(() => {
      overlay.classList.add('is-opened');
      try {
        sessionStorage.setItem(STORAGE_KEY, 'true');
      } catch (e) {}

      setTimeout(() => {
        overlay.style.display = 'none';
      }, 700);
    }, 600);
  }

  sealBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openEnvelope(true);
  });

  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openEnvelope(false);
    });
  }
}

/* ==========================================================================
   3. ARCHITECTURAL LIVE COUNTDOWN
   Target: Friday, 15th January 2027 at 7:00 PM IST (UTC+05:30)
   ========================================================================== */
function initLiveCountdown() {
  const targetDate = new Date('2027-01-15T19:00:00+05:30').getTime();

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');
  const bannerEl = document.getElementById('countdown-status-banner');

  function update() {
    const now = Date.now();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (bannerEl) {
        bannerEl.textContent = 'Alhamdulillah · The Sacred Day of Union Has Arrived';
      }
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   4. CLIENT-SIDE .ICS CALENDAR GENERATOR
   ========================================================================== */
function initCalendarDownload() {
  const btn = document.getElementById('btn-add-calendar');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();

    const eventData = {
      title: 'Solemnization of Nikah: Jassim & Shifa',
      description: "Under the grace of the Almighty Allah, the families of Mr. Muhamed Hashim and Mr. Anis Asgar Khan cordially invite you to witness the Solemnization of Nikah of Jassim Hashim & Shifa Anis Khan.\\n\\nQuran Verse 78:8: 'And We created you in pairs'\\n\\nDate: Friday, 15th January 2027 at 7:00 PM IST\\nVenue: Bagai Banquet, Ashoka Marg, Kalpataru Nagar, Nashik",
      location: 'Bagai Banquet, Ashoka Marg, Kalpataru Nagar, Nashik, Maharashtra 422011',
      startISO: '20270115T133000Z', // 7:00 PM IST is 01:30 PM (13:30) UTC
      endISO: '20270115T173000Z'    // 11:00 PM IST is 05:30 PM (17:30) UTC
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Jassim & Shifa Nikah Celebration//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:${eventData.title}`,
      `DESCRIPTION:${eventData.description}`,
      `LOCATION:${eventData.location}`,
      `DTSTART:${eventData.startISO}`,
      `DTEND:${eventData.endISO}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder: Solemnization of Nikah of Jassim & Shifa tomorrow',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'nikah-jassim-shifa.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showMicroToast('Calendar event downloaded (.ics)');
  });
}

/* ==========================================================================
   5. VENUE ADDRESS CLIPBOARD WITH INLINE FEEDBACK
   ========================================================================== */
function initAddressClipboard() {
  const copyBtn = document.getElementById('btn-copy-address');
  if (!copyBtn) return;

  const originalHtml = copyBtn.innerHTML;
  const addressText = 'Bagai Banquet, Ashoka Marg, Kalpataru Nagar, Nashik, Maharashtra 422011';

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(addressText).then(() => {
      copyBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Address Copied</span>
      `;
      copyBtn.classList.add('is-copied');

      setTimeout(() => {
        copyBtn.innerHTML = originalHtml;
        copyBtn.classList.remove('is-copied');
      }, 2400);

      showMicroToast('Venue address copied to clipboard');
    }).catch(() => {
      showMicroToast('Address: Bagai Banquet, Ashoka Marg, Nashik');
    });
  });
}

/* ==========================================================================
   6. INTERACTIVE DIGITAL DU'A & BLESSINGS WALL
   ========================================================================== */
function initBlessingsWall() {
  const form = document.getElementById('blessing-form');
  const grid = document.getElementById('blessings-wall-grid');
  const quickTags = document.querySelectorAll('.tag-pill');
  const messageInput = document.getElementById('guest-message');
  const nameInput = document.getElementById('guest-name');
  if (!grid || !form) return;

  // Default curated blessings
  const DEFAULT_BLESSINGS = [
    {
      name: 'Family Elders',
      message: 'بَارَكَ ٱللَّٰهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ. May the Almighty shower His infinite grace, tranquility, and perpetual barakah upon Jassim & Shifa.',
      date: 'Blessing of Du’a'
    },
    {
      name: 'The Khan & Hashim Families',
      message: 'May your union be blessed with deep affection, enduring patience, and mutual joy as you embark on this sacred path together.',
      date: 'Family Prayer'
    },
    {
      name: 'Well-Wishers',
      message: 'Warmest heartfelt congratulations to Jassim and Shifa! Wishing you a blessed, pious, and joyous married life ahead.',
      date: 'Celebration Blessing'
    }
  ];

  const STORAGE_KEY = 'nikah_guest_blessings';

  function isDotOnly(str) {
    if (!str) return true;
    const trimmed = str.trim();
    return trimmed === '' || /^\.+$/.test(trimmed);
  }

  function getStoredBlessings() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        let list = JSON.parse(data);
        if (Array.isArray(list)) {
          // Permanently purge any comment with name '.' or empty
          const cleaned = list.filter(b => b && b.name && !isDotOnly(b.name));
          if (cleaned.length !== list.length) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
    } catch (e) {}
    return DEFAULT_BLESSINGS;
  }

  function saveBlessings(items) {
    try {
      const cleaned = items.filter(b => b && b.name && !isDotOnly(b.name));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    } catch (e) {}
  }

  function renderBlessings() {
    const list = getStoredBlessings();
    grid.innerHTML = '';

    list.forEach((b, index) => {
      const card = document.createElement('div');
      card.className = 'blessing-card';
      card.innerHTML = `
        <div class="blessing-card-header">
          <span class="blessing-author">${escapeHtml(b.name)}</span>
          <div class="blessing-actions">
            <span class="blessing-badge">${escapeHtml(b.date || 'Blessed Prayer')}</span>
            <button type="button" class="btn-delete-card" data-index="${index}" aria-label="Remove this comment" title="Remove comment">&times;</button>
          </div>
        </div>
        <p class="blessing-text">${escapeHtml(b.message)}</p>
      `;
      grid.appendChild(card);
    });
  }

  // Allow deleting comments with click on delete button
  grid.addEventListener('click', (e) => {
    const delBtn = e.target.closest('.btn-delete-card');
    if (delBtn) {
      e.preventDefault();
      const idx = parseInt(delBtn.getAttribute('data-index'), 10);
      const list = getStoredBlessings();
      if (!isNaN(idx) && idx >= 0 && idx < list.length) {
        list.splice(idx, 1);
        saveBlessings(list);
        renderBlessings();
        showMicroToast('Comment removed');
      }
    }
  });

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Quick tag filler
  quickTags.forEach((pill) => {
    pill.addEventListener('click', () => {
      const dua = pill.getAttribute('data-dua');
      if (dua && messageInput) {
        messageInput.value = dua;
        messageInput.focus();
        showMicroToast('Du’a added to message box');
      }
    });
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = (nameInput.value || '').trim();
    const msg = (messageInput.value || '').trim();

    if (!name || isDotOnly(name)) {
      showMicroToast('Please enter your name');
      return;
    }
    if (!msg) {
      showMicroToast('Please write a message or du’a');
      return;
    }

    const list = getStoredBlessings();
    list.unshift({
      name: name,
      message: msg,
      date: 'Just now'
    });

    saveBlessings(list);
    renderBlessings();

    form.reset();
    showMicroToast('JazakAllah Khair! Your du’a has been shared.');
  });

  renderBlessings();
}

/* ==========================================================================
   7. ARCHIVAL KEEPSAKE PRINT TRIGGER
   ========================================================================== */
function initPrintTrigger() {
  const printBtn = document.getElementById('btn-print-invitation');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ==========================================================================
   8. MINIMALIST MICRO-TOAST NOTIFICATION
   ========================================================================== */
let toastTimer = null;
function showMicroToast(message) {
  let toast = document.getElementById('editorial-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'editorial-toast';
    toast.className = 'editorial-toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('is-visible');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 3200);
}
