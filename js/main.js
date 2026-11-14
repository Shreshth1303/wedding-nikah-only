/**
 * THE SOLEMNIZATION OF NIKAH — JASSIM HASHIM & SHIFA ANIS KHAN
 * Contemporary Architectural Editorial Interaction Suite
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveCountdown();
  initCalendarDownload();
  initAddressClipboard();
  initPrintTrigger();
});

/* ==========================================================================
   1. ARCHITECTURAL LIVE COUNTDOWN
   Target: Friday, 15th January 2027 at 11:30 AM IST (UTC+05:30)
   ========================================================================== */
function initLiveCountdown() {
  const targetDate = new Date('2027-01-15T11:30:00+05:30').getTime();

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
   2. CLIENT-SIDE .ICS CALENDAR GENERATOR
   ========================================================================== */
function initCalendarDownload() {
  const btn = document.getElementById('btn-add-calendar');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();

    const eventData = {
      title: 'Solemnization of Nikah: Jassim & Shifa',
      description: "Under the grace of the Almighty, the families of Mr. Muhamed Hashim and Mr. Anis Asgar Khan cordially invite you to witness the Solemnization of Nikah of Jassim Hashim & Shifa Anis Khan.\\n\\nQuran Verse 78:8: 'And We created you in pairs'\\n\\nDate: Friday, 15th January 2027 at 11:30 AM IST\\nVenue: Bagai Banquet, Ashoka Marg, Kalpataru Nagar, Nashik",
      location: 'Bagai Banquet, Ashoka Marg, Kalpataru Nagar, Nashik, Maharashtra 422011',
      startISO: '20270115T060000Z', // 11:30 AM IST is 06:00 AM UTC
      endISO: '20270115T103000Z'    // 04:00 PM IST is 10:30 AM UTC
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
   3. VENUE ADDRESS CLIPBOARD WITH INLINE FEEDBACK
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
   4. ARCHIVAL KEEPSAKE PRINT TRIGGER
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
   5. MINIMALIST MICRO-TOAST NOTIFICATION
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
  }, 3000);
}
