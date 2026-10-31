/**
 * SACRED DIGITAL INVITATION — JASSIM HASHIM & SHIFA ANIS KHAN
 * Moorish Architectural Manuscript Engine
 * Solemnization of Nikah — Friday, 15th January 2027
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initCalendarActions();
  initAmbienceSynthesizer();
  initClipboardHelpers();
});

/* ==========================================================================
   1. COUNTDOWN TO SACRED UNION
   Target: Friday, 15th January 2027 at 11:30 AM IST (UTC+05:30)
   ========================================================================== */
function initCountdown() {
  const targetDate = new Date('2027-01-15T11:30:00+05:30').getTime();

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');
  const countdownTitleEl = document.querySelector('.countdown-title');

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (countdownTitleEl) {
        countdownTitleEl.textContent = 'Alhamdulillah · The Sacred Day of Union Has Arrived';
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
   2. CALENDAR INTEGRATION (.ICS & GOOGLE CALENDAR)
   ========================================================================== */
function initCalendarActions() {
  const triggerBtn = document.getElementById('btn-calendar-trigger');
  const menuEl = document.getElementById('calendar-dropdown-menu');
  const googleBtn = document.getElementById('cal-google');
  const icsBtn = document.getElementById('cal-ics');
  const yahooBtn = document.getElementById('cal-yahoo');

  if (!triggerBtn || !menuEl) return;

  // Toggle calendar options dropdown
  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menuEl.classList.toggle('active');
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuEl.contains(e.target) && e.target !== triggerBtn) {
      menuEl.classList.remove('active');
    }
  });

  const eventData = {
    title: 'Solemnization of Nikah: Jassim & Shifa',
    description: "Under the grace of the Almighty, Mr. Muhamed Hashim & Mrs. Mumtaz Muhamed Hashim together with Mr. Anis Asgar Khan & Mrs. Shabana Anis Khan cordially invite you to witness the Nikah of Jassim & Shifa.\\n\\nQuran Verse 78:8: 'And We created you in pairs'\\n\\nVenue: Bagai Banquet, Ashoka Marg, Nashik.",
    location: 'Bagai Banquet, Ashoka Marg, Nashik, Maharashtra',
    startISO: '20270115T060000Z', // 11:30 AM IST is 06:00 AM UTC
    endISO: '20270115T103000Z',   // 04:00 PM IST is 10:30 AM UTC
  };

  // Google Calendar Link
  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      menuEl.classList.remove('active');
      const gUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventData.title)}&dates=${eventData.startISO}/${eventData.endISO}&details=${encodeURIComponent(eventData.description)}&location=${encodeURIComponent(eventData.location)}`;
      window.open(gUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // Yahoo Calendar Link
  if (yahooBtn) {
    yahooBtn.addEventListener('click', () => {
      menuEl.classList.remove('active');
      const yUrl = `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodeURIComponent(eventData.title)}&st=${eventData.startISO}&et=${eventData.endISO}&desc=${encodeURIComponent(eventData.description)}&in_loc=${encodeURIComponent(eventData.location)}`;
      window.open(yUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // ICS File Generation for Apple / Outlook Calendar
  if (icsBtn) {
    icsBtn.addEventListener('click', () => {
      menuEl.classList.remove('active');
      generateICSFile(eventData);
      showToast('Nikah Calendar invitation (.ics) downloaded.');
    });
  }
}

function generateICSFile(event) {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Jassim & Shifa Nikah Sanctuary//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    `DTSTART:${event.startISO}`,
    `DTEND:${event.endISO}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Nikah of Jassim & Shifa tomorrow',
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
}

/* ==========================================================================
   3. MEDITATIVE SACRED AMBIENCE (PURE WEB AUDIO SYNTHESIZER)
   No external files needed, no 404s, works offline!
   Harmonic 432Hz D-minor chord + gentle shimmer
   ========================================================================== */
function initAmbienceSynthesizer() {
  const toggleBtn = document.getElementById('btn-audio-toggle');
  const labelEl = document.getElementById('audio-label');
  if (!toggleBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let masterGain = null;
  let oscillators = [];
  let intervalId = null;

  function startAmbience() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      audioCtx = new AudioContextClass();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
      // Gentle fade in
      masterGain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 3);
      masterGain.connect(audioCtx.destination);

      // Sacred Solfeggio & D minor meditative harmonic frequencies
      // D3 (146.83Hz), A3 (220.00Hz), D4 (293.66Hz), F4 (349.23Hz)
      const droneFreqs = [146.83, 220.00, 293.66, 349.23];

      oscillators = droneFreqs.map((freq, i) => {
        const osc = audioCtx.createOscillator();
        const panner = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;
        const gain = audioCtx.createGain();

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        // Gentle subtle detuning for sacred warmth
        const detune = (i - 1.5) * 2.5;
        osc.detune.setValueAtTime(detune, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.04 / (i + 1), audioCtx.currentTime);

        if (panner) {
          panner.pan.setValueAtTime((i % 2 === 0 ? -0.4 : 0.4), audioCtx.currentTime);
          osc.connect(gain);
          gain.connect(panner);
          panner.connect(masterGain);
        } else {
          osc.connect(gain);
          gain.connect(masterGain);
        }

        osc.start();
        return osc;
      });

      // Periodic ethereal high chime tone (mimicking gentle brass singing bowl)
      intervalId = setInterval(() => {
        if (!audioCtx || !isPlaying) return;
        playSereneChime(audioCtx, masterGain);
      }, 7000);

      isPlaying = true;
      toggleBtn.classList.add('playing');
      if (labelEl) labelEl.textContent = 'Ambience: Flowing';
      showToast('Sacred acoustic ambience initiated.');
    } catch (err) {
      console.warn('Audio synthesis could not start:', err);
    }
  }

  function playSereneChime(ctx, destination) {
    try {
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();

      // High gentle note (A5 - 880Hz or E6 - 1318Hz)
      const chimes = [880, 1046.5, 1174.66, 1318.51];
      const note = chimes[Math.floor(Math.random() * chimes.length)];

      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(note, ctx.currentTime);

      const now = ctx.currentTime;
      chimeGain.gain.setValueAtTime(0, now);
      chimeGain.gain.linearRampToValueAtTime(0.025, now + 0.6);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(destination);

      chimeOsc.start(now);
      chimeOsc.stop(now + 6);
    } catch (e) {}
  }

  function stopAmbience() {
    if (audioCtx && masterGain) {
      masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 1.5);
      setTimeout(() => {
        oscillators.forEach(osc => {
          try { osc.stop(); osc.disconnect(); } catch (e) {}
        });
        oscillators = [];
        if (intervalId) clearInterval(intervalId);
        if (audioCtx) audioCtx.close();
        audioCtx = null;
      }, 1600);
    }
    isPlaying = false;
    toggleBtn.classList.remove('playing');
    if (labelEl) labelEl.textContent = 'Sacred Ambience';
    showToast('Ambience paused.');
  }

  toggleBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopAmbience();
    } else {
      startAmbience();
    }
  });
}

/* ==========================================================================
   5. CLIPBOARD & INTERACTION HELPERS
   ========================================================================== */
function initClipboardHelpers() {
  const copyAddressBtn = document.getElementById('btn-copy-address');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const address = "Bagai Banquet, Ashoka Marg, Nashik, Maharashtra";
      navigator.clipboard.writeText(address).then(() => {
        showToast('Venue address copied to clipboard.');
      }).catch(() => {
        showToast('Address: Bagai Banquet, Ashoka Marg, Nashik');
      });
    });
  }

  // Print Keepsake action
  const printBtn = document.getElementById('btn-print-invitation');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ==========================================================================
   6. TOAST NOTIFICATION UTILITY
   ========================================================================== */
let toastTimeout = null;
function showToast(message) {
  let toast = document.getElementById('sanctuary-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'sanctuary-toast';
    toast.className = 'sanctuary-toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('visible');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('visible');
  }, 3400);
}

function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

