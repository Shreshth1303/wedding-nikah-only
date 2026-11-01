/**
 * SACRED DIGITAL INVITATION — JASSIM HASHIM & SHIFA ANIS KHAN
 * Moorish Architectural Manuscript Engine
 * Solemnization of Nikah — Friday, 15th January 2027
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initCalendarActions();
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

