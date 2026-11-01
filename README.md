# The Solemnization of Nikah · Jassim Hashim & Shifa Anis Khan

A serene, sacred-minimalist digital invitation designed under the philosophy of a **"Moorish Architectural Manuscript"**.

---

## ✦ Design Philosophy: "Moorish Architectural Manuscript"

- **Visual Metaphor:** An ancient hand-pressed vellum scroll enclosed within a contemporary Moorish pointed arch silhouette.
- **Sacred Color Palette:**
  - **Ivory Linen** (`#FAF8F5`) — Base canvas and hand-pressed vellum scroll.
  - **Warm Sepia** (`#2C2523`) — Rich calligraphic ink and timeless typography.
  - **Champagne Gold** (`#D4AF37`) — Gilded foil accents, geometric flourishes, and borders.
  - **Subdued Olive Mist** (`#E8ECE9`) — Architectural tympanum and spandrel relief.
- **Art Direction:** CSS `clip-path` and vector arch silhouettes, vector Bismillah calligraphic medallion, delicate multi-line *Jadwal* borders with corner palmettes, zero fluff, zero AI-generated photography.

---

## ✦ Event Specifications & Information Architecture

- **Ceremony:** Solemnization of Nikah
- **Groom:** Jassim Hashim (*Son of Mr. Muhamed Hashim & Mrs. Mumtaz Muhamed Hashim*)
- **Bride:** Shifa Anis Khan (*Daughter of Mr. Anis Asgar Khan & Mrs. Shabana Anis Khan*)
- **Sacred Scripture:** Quran Verse 78:8 (*وَخَلَقْنَاكُمْ أَزْوَاجًا* — *"And We created you in pairs"*)
- **Date:** Friday, 15th January 2027 (7 Rajab 1448 AH)
- **Venue:** Bagai Banquet, Ashoka Marg, Nashik, Maharashtra
- **Map Target:** "Bagai Banquet Ashoka Marg Nashik"
- **Copyright Year:** 2027

---

## ✦ Key Architectural Features

1. **Single-Stage Central Canvas:**
   - Tall, elegant architectural Moorish arch frame centered on screen with soft ambient illumination.
   - Repeating Girih 8-fold geometric star vector texture (`assets/girih-pattern.svg`) tiling seamlessly across the outer canvas.
   - Multi-line *Jadwal* ruling with corner manuscript palmettes.

2. **The Sacred Crest & Inscription:**
   - Top of the arch features an intricate vector Bismillah calligraphic medallion (`assets/bismillah.svg`).
   - Quran Verse 78:8 rendered in authentic Arabic typography (`Amiri`) with the English translation centered in delicate italic serif (`Cormorant Garamond`).

3. **Formal Parentage & Proclamation:**
   - Structured manuscript format with full paternal lineage and grand couple showcase.

4. **Venue Sanctuary Card:**
   - Date, Hijri calendar date, and complete itinerary (Welcome, Nikah Ceremony, Dua & Blessings, Royal Feast).
   - Direct action: **Open Venue in Google Maps** (`https://www.google.com/maps/search/?api=1&query=Bagai+Banquet+Ashoka+Marg+Nashik`).
   - Calendar Integration: **Google Calendar**, **Apple / Outlook (.ics file)**, and **Yahoo Calendar**.
   - One-click **Copy Venue Address** with feedback toast.
   - Live **Countdown Timer** to Friday, 15th January 2027 at 11:30 AM IST.

5. **Melodious Background Music Engine (`js/audio-controller.js`):**
   - High-fidelity acoustic instrumentation:
     - Primary: *Canon in D Major* arranged with 3 violins, bass continuo, and double harp by Kevin MacLeod (CC BY 3.0).
     - Alternate: *Recuerdos de la Alhambra* classical guitar tribute to Moorish Alhambra by Francisco Tárrega (CC BY-SA 3.0).
   - Intelligent browser autoplay policy handling:
     - Automatically starts playback on load when permitted by the browser.
     - Unobtrusive floating prompt (`#audio-floating-prompt`) enables playback on a single click if unmuted autoplay is restricted.
     - Passive first-interaction listener resumes audio seamlessly upon the visitor's first page interaction.
   - Smooth volume ramping (fade-in on play, fade-out on pause) at a gentle initial volume (~0.35).
   - Session storage persistence preserves playback position, play/pause state, and volume across page navigations.
   - Full keyboard accessibility and animated soundwave equalizer.

6. **Clean Sanctuary Navigation (Zero 404 Links):**
   - Desktop and mobile menus point strictly to legitimate on-page sections (`#ceremony`, `#venue`, `#countdown`).
   - No navigation links redirect to 404 error routes.
   - Dynamic logo returns cleanly to the sanctuary root.

7. **Dedicated 404 Error Route & Server Handling:**
   - `404.html` styled as a tranquil parchment page with clear "Page Not Found", 404 numeral, and return button.
   - Root-relative paths and `<base href="/">` ensure styling persists on deeply nested invalid paths.
   - Configured `serve.json` and production `server.js` returning HTTP 404 status codes and HTTP 206 audio Range streaming.

8. **Print & Keepsake Ready:**
   - Print stylesheet (`@media print`) that formats the page into an archival museum-quality Nikah keepsake card ready for high-resolution PDF export or physical framing.

---

## ✦ Directory Structure

```
wedding-nikah-only/
├── index.html              # Main single-stage Moorish architectural invitation
├── 404.html                # Dedicated tranquil parchment 404 page
├── serve.json              # Static server routing & audio header configuration
├── server.js               # Standalone HTTP 1.1 production server (with 206 Range streaming & 404 handling)
├── package.json            # Development scripts & test runner
├── README.md               # Documentation & design specifications
├── assets/
│   ├── favicon.svg         # Gold crescent & Moorish arch dynamic vector favicon
│   ├── bismillah.svg       # Master calligraphic Bismillah medallion
│   ├── seal.svg            # Arabic calligraphy seal
│   ├── girih-pattern.svg   # 8-fold Islamic geometric Girih tiling texture
│   └── audio/
│       ├── canon-in-d.mp3                 # Canon in D (Violins & Harp Duet)
│       ├── recuerdos-de-la-alhambra.ogg   # Moorish classical guitar
│       └── LICENSE.md                     # Full royalty-free licensing attribution
├── css/
│   └── style.css           # Complete manuscript layout, arch styling, audio suite & animations
├── js/
│   ├── audio-controller.js # Singleton background music engine & autoplay handler
│   └── main.js             # Countdown, calendar .ics generator, clipboard helpers
└── test/
    └── suite.js            # Automated verification test suite
```

---

## ✦ Development & Testing

```bash
# Run automated test suite
npm test

# Start local server
npm start
```
