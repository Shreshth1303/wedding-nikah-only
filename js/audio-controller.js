/**
 * SACRED DIGITAL INVITATION — JASSIM HASHIM & SHIFA ANIS KHAN
 * Elegant Background Music Controller & Autoplay Handler
 * 
 * Features:
 * - Singleton audio architecture (zero duplicate audio instances)
 * - Intelligent autoplay handling with browser policy compliance
 * - Single-click elegant prompt when unmuted autoplay is restricted
 * - One-time gentle user interaction resume
 * - Smooth volume fading (fade-in on start, fade-out on pause)
 * - Session state persistence across internal navigation (currentTime, playing, muted)
 * - Full accessibility: ARIA labels, keyboard focus, reduced motion support
 * - Dual track selection: Chopin Nocturne Op. 9 No. 2 (Classical Piano) & Recuerdos de la Alhambra (Moorish Guitar)
 */

(function () {
  'use strict';

  // Prevent multiple instances
  if (window.__NIKAH_AUDIO_CONTROLLER__) {
    return;
  }

  const STORAGE_KEYS = {
    STATE: 'wedding_music_state',
    TIME: 'wedding_music_time',
    MUTED: 'wedding_music_muted',
    TRACK: 'wedding_music_track',
    VOLUME: 'wedding_music_volume',
    DISMISSED: 'wedding_music_prompt_dismissed'
  };

  const TRACKS = {
    chopin: {
      id: 'chopin',
      title: 'Nocturne in E-flat major, Op. 9 No. 2',
      subtitle: 'Frédéric Chopin · Serene Classical Piano (Public Domain)',
      shortName: 'Chopin · Nocturne in E-flat',
      src: 'assets/audio/chopin-nocturne.mp3',
      type: 'audio/mpeg'
    },
    alhambra: {
      id: 'alhambra',
      title: 'Recuerdos de la Alhambra',
      subtitle: 'Francisco Tárrega · Classical Guitar (CC BY-SA 3.0)',
      shortName: 'Alhambra · Moorish Guitar',
      src: 'assets/audio/recuerdos-de-la-alhambra.ogg',
      type: 'audio/ogg'
    }
  };

  class NikahAudioController {
    constructor() {
      this.TARGET_VOLUME = 0.35;
      this.currentTrackId = this.getStoredTrack();
      this.audio = null;
      this.isPlaying = false;
      this.isFading = false;
      this.fadeInterval = null;
      this.hasUserInteracted = false;
      this.isAutoplayBlocked = false;
      this.isExplicitlyPaused = false;

      this.init();
    }

    getStoredTrack() {
      try {
        const stored = sessionStorage.getItem(STORAGE_KEYS.TRACK);
        if (stored === 'canon' || !TRACKS[stored]) {
          sessionStorage.removeItem(STORAGE_KEYS.TRACK);
          sessionStorage.removeItem(STORAGE_KEYS.TIME);
          sessionStorage.setItem(STORAGE_KEYS.TRACK, 'chopin');
          return 'chopin';
        }
        return stored;
      } catch (e) {
        return 'chopin';
      }
    }

    init() {
      this.createAudioElement();
      this.renderControls();
      this.bindEvents();
      this.attemptInitialPlayback();
    }

    createAudioElement() {
      let existing = document.getElementById('wedding-audio-element');
      if (existing) {
        this.audio = existing;
      } else {
        this.audio = document.createElement('audio');
        this.audio.id = 'wedding-audio-element';
        this.audio.preload = 'auto';
        this.audio.loop = true;
        this.audio.setAttribute('playsinline', '');
        this.audio.setAttribute('webkit-playsinline', '');
        this.audio.style.display = 'none';
        document.body.appendChild(this.audio);
      }

      this.loadTrack(this.currentTrackId, false);

      // Restore muted state
      try {
        const isMuted = sessionStorage.getItem(STORAGE_KEYS.MUTED) === 'true';
        this.audio.muted = isMuted;
      } catch (e) {
        this.audio.muted = false;
      }

      // Restore volume
      try {
        const savedVol = parseFloat(sessionStorage.getItem(STORAGE_KEYS.VOLUME));
        if (!isNaN(savedVol) && savedVol >= 0 && savedVol <= 1) {
          this.TARGET_VOLUME = savedVol;
        }
      } catch (e) {}

      // Throttled timeupdate persistence
      let lastTimeSaved = 0;
      this.audio.addEventListener('timeupdate', () => {
        const now = Date.now();
        if (now - lastTimeSaved > 1000) {
          lastTimeSaved = now;
          this.persistTime();
        }
      });

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.updateUIState();
        try {
          sessionStorage.setItem(STORAGE_KEYS.STATE, 'playing');
        } catch (e) {}
      });

      this.audio.addEventListener('pause', () => {
        if (!this.isFading) {
          this.isPlaying = false;
          this.updateUIState();
        }
      });
    }

    loadTrack(trackId, shouldPlay = false) {
      if (trackId === 'canon' || !TRACKS[trackId]) {
        trackId = 'chopin';
      }
      const track = TRACKS[trackId] || TRACKS.chopin;
      this.currentTrackId = track.id;
      try {
        sessionStorage.setItem(STORAGE_KEYS.TRACK, track.id);
      } catch (e) {}

      // Check if root relative resolution needed
      let src = track.src;
      // In case we are on a nested route, use leading slash if base href isn't active
      if (!src.startsWith('/') && !src.startsWith('http')) {
        const base = document.querySelector('base');
        if (!base) {
          // If in subfolder, resolve relative to root
          const pathSegments = window.location.pathname.split('/').filter(Boolean);
          if (pathSegments.length > 1 && !window.location.pathname.endsWith('.html')) {
            src = '/' + src;
          }
        }
      }

      const prevTime = this.getStoredTime();
      this.audio.src = src;

      if (prevTime > 0) {
        this.audio.currentTime = prevTime;
      }

      if (shouldPlay) {
        this.playWithFade();
      }
    }

    getStoredTime() {
      try {
        const t = parseFloat(sessionStorage.getItem(STORAGE_KEYS.TIME));
        return !isNaN(t) && t > 0 ? t : 0;
      } catch (e) {
        return 0;
      }
    }

    persistTime() {
      try {
        if (this.audio && this.audio.currentTime > 0) {
          sessionStorage.setItem(STORAGE_KEYS.TIME, String(this.audio.currentTime));
        }
      } catch (e) {}
    }

    attemptInitialPlayback() {
      this.isExplicitlyPaused = false;
      try {
        sessionStorage.removeItem(STORAGE_KEYS.STATE);
      } catch (e) {}

      // Try unlocking Web Audio API context
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          if (!this.audioCtx) this.audioCtx = new AudioCtx();
          if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume().catch(() => {});
          }
        }
      } catch (e) {}

      // 1. Direct unmuted playback attempt
      this.audio.muted = false;
      this.audio.volume = 0;

      const playPromise = this.audio.play();

      if (playPromise !== undefined) {
        playPromise.then(() => {
          // Autoplay permitted by browser!
          this.isPlaying = true;
          this.isAutoplayBlocked = false;
          this.fadeIn(this.TARGET_VOLUME, 1200);
          this.updateUIState();
          this.hideAutoplayPrompt();
        }).catch((error) => {
          // Browser blocked unmuted autoplay policy.
          this.isAutoplayBlocked = true;

          // Start playing muted immediately so stream/decoding is actively running
          this.audio.muted = true;
          const mutedPromise = this.audio.play();
          if (mutedPromise !== undefined) {
            mutedPromise.then(() => {
              this.isPlaying = true;
              this.updateUIState();
            }).catch(() => {});
          }

          // Show floating interaction badge
          this.showAutoplayPrompt();
        });
      }
    }

    unlockAndPlay() {
      if (!this.audio) return;

      // Unlock Web Audio Context
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          if (!this.audioCtx) this.audioCtx = new AudioCtx();
          if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume().catch(() => {});
          }
        }
      } catch (e) {}

      this.audio.muted = false;
      this.isAutoplayBlocked = false;

      // If audio element is already running (e.g. muted), smoothly fade volume in!
      if (!this.audio.paused && this.audio.currentTime > 0) {
        this.isPlaying = true;
        this.fadeIn(this.TARGET_VOLUME, 1000);
        this.updateUIState();
        this.hideAutoplayPrompt();
        return;
      }

      // Otherwise start playback with fade
      this.audio.volume = 0;
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.isPlaying = true;
          this.fadeIn(this.TARGET_VOLUME, 1200);
          this.updateUIState();
          this.hideAutoplayPrompt();
        }).catch((err) => {
          console.warn('Playback gesture unlock attempt:', err);
        });
      }
    }

    playWithFade() {
      this.unlockAndPlay();
    }

    pauseWithFade() {
      if (!this.audio || !this.isPlaying) return;
      this.fadeOut(0.01, 800, () => {
        this.audio.pause();
        this.isPlaying = false;
        this.isFading = false;
        this.audio.volume = this.TARGET_VOLUME;
        this.updateUIState();
      });
    }

    togglePlayPause() {
      if (this.isPlaying && !this.audio.paused && !this.audio.muted) {
        this.isExplicitlyPaused = true;
        this.pauseWithFade();
        try {
          sessionStorage.setItem(STORAGE_KEYS.STATE, 'paused');
        } catch (e) {}
      } else {
        this.isExplicitlyPaused = false;
        this.unlockAndPlay();
        try {
          sessionStorage.setItem(STORAGE_KEYS.STATE, 'playing');
        } catch (e) {}
      }
    }

    toggleMute() {
      if (!this.audio) return;
      this.audio.muted = !this.audio.muted;
      try {
        sessionStorage.setItem(STORAGE_KEYS.MUTED, String(this.audio.muted));
      } catch (e) {}
      this.updateUIState();
    }

    fadeIn(targetVolume, duration = 1000) {
      if (!this.audio) return;
      this.isFading = true;
      if (this.fadeInterval) clearInterval(this.fadeInterval);

      const start = Date.now();
      const initialVol = this.audio.volume;
      const stepTime = 30;

      this.fadeInterval = setInterval(() => {
        const elapsed = Date.now() - start;
        const progress = Math.min(1, elapsed / duration);
        this.audio.volume = initialVol + (targetVolume - initialVol) * progress;

        if (progress >= 1) {
          clearInterval(this.fadeInterval);
          this.audio.volume = targetVolume;
          this.isFading = false;
        }
      }, stepTime);
    }

    fadeOut(targetVolume = 0, duration = 800, onComplete) {
      if (!this.audio) return;
      this.isFading = true;
      if (this.fadeInterval) clearInterval(this.fadeInterval);

      const start = Date.now();
      const initialVol = this.audio.volume;
      const stepTime = 30;

      this.fadeInterval = setInterval(() => {
        const elapsed = Date.now() - start;
        const progress = Math.min(1, elapsed / duration);
        this.audio.volume = Math.max(0, initialVol - (initialVol - targetVolume) * progress);

        if (progress >= 1) {
          clearInterval(this.fadeInterval);
          this.audio.volume = targetVolume;
          this.isFading = false;
          if (typeof onComplete === 'function') onComplete();
        }
      }, stepTime);
    }

    switchTrack(trackId) {
      if (trackId === this.currentTrackId) return;
      const wasPlaying = this.isPlaying;
      this.fadeOut(0, 500, () => {
        this.loadTrack(trackId, wasPlaying);
      });
    }

    /* ========================================================================
       UI RENDERING & DOM INTEGRATION
       ======================================================================== */
    renderControls() {
      // Look for target container in navbar
      const container = document.getElementById('music-controller-container');
      if (!container) return;

      const track = TRACKS[this.currentTrackId];

      container.innerHTML = `
        <div class="sacred-audio-suite" role="region" aria-label="Sacred Background Music Controls">
          <!-- Play / Pause Master Button -->
          <button type="button" 
                  id="music-play-btn" 
                  class="audio-control-pill" 
                  aria-label="${this.isPlaying ? 'Pause background music' : 'Play serene background music'}"
                  aria-pressed="${this.isPlaying}">
            <span class="audio-control-icon" id="music-play-icon" aria-hidden="true">
              ${this.getPlayPauseSvg()}
            </span>
            <div class="audio-soundwaves ${this.isPlaying && !this.audio.muted ? 'playing' : ''}" aria-hidden="true">
              <span class="wave-bar bar-1"></span>
              <span class="wave-bar bar-2"></span>
              <span class="wave-bar bar-3"></span>
              <span class="wave-bar bar-4"></span>
            </div>
            <span class="audio-title-display" id="music-title-display">
              ${track.shortName}
            </span>
          </button>

          <!-- Mute / Unmute Button -->
          <button type="button" 
                  id="music-mute-btn" 
                  class="audio-mute-toggle" 
                  aria-label="${this.audio.muted ? 'Unmute background music' : 'Mute background music'}"
                  title="${this.audio.muted ? 'Unmute' : 'Mute'}">
            <span id="music-mute-icon" aria-hidden="true">
              ${this.getMuteSvg()}
            </span>
          </button>
        </div>
      `;

      this.ensureFloatingPromptDOM();
    }

    ensureFloatingPromptDOM() {
      if (document.getElementById('audio-floating-prompt')) return;

      const prompt = document.createElement('aside');
      prompt.id = 'audio-floating-prompt';
      prompt.className = 'audio-floating-prompt';
      prompt.setAttribute('role', 'status');
      prompt.setAttribute('aria-live', 'polite');
      prompt.innerHTML = `
        <div class="prompt-glow-orb" aria-hidden="true"></div>
        <button type="button" class="prompt-main-action" id="prompt-play-trigger" aria-label="Enable Serene Wedding Ambience Music">
          <span class="prompt-music-glyph" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          </span>
          <span class="prompt-copy-text">
            <strong>Serene Ambience</strong>
            <small>Click to enable music</small>
          </span>
          <span class="prompt-action-pill" aria-hidden="true">
            Play ▶
          </span>
        </button>
        <button type="button" class="prompt-dismiss-btn" id="prompt-dismiss-btn" aria-label="Dismiss music suggestion">
          &times;
        </button>
      `;

      document.body.appendChild(prompt);
    }

    bindEvents() {
      // 1. Interactive controls click handlers
      document.addEventListener('click', (e) => {
        const playBtn = e.target.closest('#music-play-btn');
        if (playBtn) {
          e.preventDefault();
          this.togglePlayPause();
          return;
        }

        const muteBtn = e.target.closest('#music-mute-btn');
        if (muteBtn) {
          e.preventDefault();
          this.toggleMute();
          return;
        }

        const promptTrigger = e.target.closest('#prompt-play-trigger');
        if (promptTrigger) {
          e.preventDefault();
          this.isExplicitlyPaused = false;
          this.unlockAndPlay();
          return;
        }

        const promptDismiss = e.target.closest('#prompt-dismiss-btn');
        if (promptDismiss) {
          e.preventDefault();
          this.hideAutoplayPrompt();
          try {
            sessionStorage.setItem(STORAGE_KEYS.DISMISSED, 'true');
          } catch (e) {}
          return;
        }

        // Global Pointer / Click Fallback:
        // Any click anywhere on the page starts the ambient music if not yet actively playing
        if (!this.isExplicitlyPaused && (!this.isPlaying || this.audio.paused || this.audio.muted)) {
          this.unlockAndPlay();
        }
      });

      // Pointerdown on document (triggers before click on touch and mouse)
      document.addEventListener('pointerdown', (e) => {
        if (e.target.closest('#prompt-dismiss-btn') || e.target.closest('#music-play-btn') || e.target.closest('#music-mute-btn')) {
          return;
        }
        if (!this.isExplicitlyPaused && (!this.isPlaying || this.audio.paused || this.audio.muted)) {
          this.unlockAndPlay();
        }
      });

      // Touchstart for mobile and tablet browsers
      document.addEventListener('touchstart', (e) => {
        if (e.target.closest('#prompt-dismiss-btn') || e.target.closest('#music-play-btn') || e.target.closest('#music-mute-btn')) {
          return;
        }
        if (!this.isExplicitlyPaused && (!this.isPlaying || this.audio.paused || this.audio.muted)) {
          this.unlockAndPlay();
        }
      }, { passive: true });

      // Keydown on document (Space, Enter, Arrows)
      document.addEventListener('keydown', (e) => {
        if (!this.isExplicitlyPaused && (!this.isPlaying || this.audio.paused || this.audio.muted)) {
          this.unlockAndPlay();
        }
      });

      // Synchronize before page changes
      window.addEventListener('beforeunload', () => {
        this.persistTime();
      });
    }

    updateUIState() {
      const playBtn = document.getElementById('music-play-btn');
      const playIcon = document.getElementById('music-play-icon');
      const soundwaves = document.querySelector('.audio-soundwaves');
      const titleDisplay = document.getElementById('music-title-display');
      const muteBtn = document.getElementById('music-mute-btn');
      const muteIcon = document.getElementById('music-mute-icon');

      const isMuted = this.audio ? this.audio.muted : false;
      const isActivelySounding = this.isPlaying && !isMuted;

      if (playBtn) {
        playBtn.setAttribute('aria-pressed', String(this.isPlaying));
        playBtn.setAttribute('aria-label', this.isPlaying ? 'Pause background music' : 'Play serene background music');
        if (this.isPlaying) {
          playBtn.classList.add('is-playing');
        } else {
          playBtn.classList.remove('is-playing');
        }
      }

      if (playIcon) {
        playIcon.innerHTML = this.getPlayPauseSvg();
      }

      if (soundwaves) {
        if (isActivelySounding) {
          soundwaves.classList.add('playing');
        } else {
          soundwaves.classList.remove('playing');
        }
      }

      if (titleDisplay) {
        const track = TRACKS[this.currentTrackId];
        titleDisplay.textContent = track ? track.shortName : 'Sacred Wedding Hymn';
      }

      if (muteBtn) {
        muteBtn.setAttribute('aria-label', isMuted ? 'Unmute background music' : 'Mute background music');
        muteBtn.setAttribute('title', isMuted ? 'Unmute' : 'Mute');
        if (isMuted) {
          muteBtn.classList.add('is-muted');
        } else {
          muteBtn.classList.remove('is-muted');
        }
      }

      if (muteIcon) {
        muteIcon.innerHTML = this.getMuteSvg();
      }
    }

    showAutoplayPrompt() {
      try {
        if (sessionStorage.getItem(STORAGE_KEYS.DISMISSED) === 'true') {
          return;
        }
      } catch (e) {}

      setTimeout(() => {
        const prompt = document.getElementById('audio-floating-prompt');
        if (prompt && !this.isPlaying) {
          prompt.classList.add('visible');
        }
      }, 700);
    }

    hideAutoplayPrompt() {
      const prompt = document.getElementById('audio-floating-prompt');
      if (prompt) {
        prompt.classList.remove('visible');
      }
    }

    getPlayPauseSvg() {
      if (this.isPlaying) {
        // Pause Icon (two elegant vertical rounded bars)
        return `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <rect x="5" y="4" width="4" height="16" rx="1.5"></rect>
            <rect x="15" y="4" width="4" height="16" rx="1.5"></rect>
          </svg>
        `;
      } else {
        // Play Icon (golden triangle)
        return `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <polygon points="6 4 20 12 6 20 6 4"></polygon>
          </svg>
        `;
      }
    }

    getMuteSvg() {
      const isMuted = this.audio ? this.audio.muted : false;
      if (isMuted) {
        // Muted Icon with slash
        return `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        `;
      } else {
        // Volume / Sound Waves Icon
        return `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
        `;
      }
    }
  }

  // Auto-initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.__NIKAH_AUDIO_CONTROLLER__ = new NikahAudioController();
    });
  } else {
    window.__NIKAH_AUDIO_CONTROLLER__ = new NikahAudioController();
  }
})();

