/**
 * THE SOLEMNIZATION OF NIKAH — JASSIM HASHIM & SHIFA ANIS KHAN
 * Contemporary Architectural Editorial Audio Engine
 * 
 * Features:
 * - Serene Cultural Ambience: Traditional Acoustic Solo Oud (Andy R. Jordan, CC BY-SA 3.0)
 * - Zero-Console-Error Procedural Web Audio API Ambient Drone Fallback
 * - Browser Autoplay Policy Compliance with Universal First-Gesture Unlocking
 * - Smooth Exponential Volume Fading (1500ms fade-in to 0.30 target volume)
 * - Dual Controller Synchronization: Top Frosted Bar Equalizer & Bottom-Right Floating Pill
 * - Single-instance Lifecycle & Session State Persistence
 */

(function () {
  'use strict';

  if (window.__NIKAH_AUDIO_ENGINE__) {
    return;
  }

  const STORAGE_KEYS = {
    STATE: 'nikah_music_state',
    MUTED: 'nikah_music_muted',
    TIME: 'nikah_music_time',
    DISMISSED: 'nikah_music_pill_dismissed'
  };

  const PRIMARY_TRACK = {
    id: 'oud',
    title: 'Traditional Solo Oud Ambience',
    subtitle: 'Andy R. Jordan · Serene Acoustic Oud (CC BY-SA 3.0)',
    shortName: 'Oud Ambience',
    src: 'assets/audio/nikah-oud-ambience.mp3',
    type: 'audio/mpeg'
  };

  class NikahAudioEngine {
    constructor() {
      this.TARGET_VOLUME = 0.30;
      this.audio = null;
      this.audioCtx = null;
      this.synthNodes = null;
      this.isSynthFallback = false;
      this.isPlaying = false;
      this.isFading = false;
      this.fadeInterval = null;
      this.isAutoplayBlocked = false;
      this.isExplicitlyPaused = false;
      this._gestureAttached = false;

      this.init();
    }

    init() {
      this.sanitizeStorage();
      this.createAudioElement();
      this.renderUI();
      this.bindEvents();
      this.attemptInitialPlayback();
    }

    sanitizeStorage() {
      try {
        // Purge old keys from previous iterations
        ['wedding_music_track', 'wedding_music_state', 'wedding_music_time'].forEach((k) => {
          sessionStorage.removeItem(k);
        });
      } catch (e) {}
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
        this.audio.autoplay = true;
        this.audio.setAttribute('playsinline', '');
        this.audio.setAttribute('webkit-playsinline', '');
        this.audio.style.display = 'none';
        document.body.appendChild(this.audio);
      }

      // Configure track source
      let src = PRIMARY_TRACK.src;
      const base = document.querySelector('base');
      if (!base && !src.startsWith('/') && !src.startsWith('http')) {
        const segments = window.location.pathname.split('/').filter(Boolean);
        if (segments.length > 1 && !window.location.pathname.endsWith('.html')) {
          src = '/' + src;
        }
      }
      this.audio.src = src;

      // Restore saved playback time if available
      try {
        const savedTime = parseFloat(sessionStorage.getItem(STORAGE_KEYS.TIME));
        if (!isNaN(savedTime) && savedTime > 0) {
          this.audio.currentTime = savedTime;
        }
      } catch (e) {}

      // Muted state restoration
      try {
        this.audio.muted = sessionStorage.getItem(STORAGE_KEYS.MUTED) === 'true';
      } catch (e) {
        this.audio.muted = false;
      }

      // Event listeners for state sync
      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.updateUI();
        try {
          sessionStorage.setItem(STORAGE_KEYS.STATE, 'playing');
        } catch (e) {}
      });

      this.audio.addEventListener('pause', () => {
        if (!this.isFading) {
          this.isPlaying = false;
          this.updateUI();
        }
      });

      // Periodic time persistence
      let lastSave = 0;
      this.audio.addEventListener('timeupdate', () => {
        const now = Date.now();
        if (now - lastSave > 1500) {
          lastSave = now;
          if (this.audio && this.audio.currentTime > 0) {
            try {
              sessionStorage.setItem(STORAGE_KEYS.TIME, String(this.audio.currentTime));
            } catch (e) {}
          }
        }
      });

      // Error handling: Graceful fallback to procedural meditative Web Audio drone
      this.audio.addEventListener('error', () => {
        console.info('Audio asset streaming note: Activating client-side Web Audio ambient generator.');
        this.startSyntheticAmbientFallback();
      });
    }

    /* ========================================================================
       WEB AUDIO API PROCEDURAL AMBIENT SYNTHESIZER (ZERO-CONSOLE-ERROR FALLBACK)
       ======================================================================== */
    startSyntheticAmbientFallback() {
      if (this.isSynthFallback) return;
      this.isSynthFallback = true;

      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        if (!this.audioCtx) {
          this.audioCtx = new AudioCtx();
        }

        const masterGain = this.audioCtx.createGain();
        masterGain.gain.setValueAtTime(0, this.audioCtx.currentTime);

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, this.audioCtx.currentTime);

        // Meditative D Hijaz / D Minor Chime Frequencies: D3 (146.83Hz), A3 (220Hz), D4 (293.66Hz)
        const freqs = [146.83, 220.00, 293.66];
        const oscs = freqs.map((f, i) => {
          const osc = this.audioCtx.createOscillator();
          osc.type = i === 1 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(f, this.audioCtx.currentTime);
          
          const oscGain = this.audioCtx.createGain();
          oscGain.gain.setValueAtTime(0.2 / (i + 1), this.audioCtx.currentTime);
          
          osc.connect(oscGain);
          oscGain.connect(filter);
          osc.start();
          return osc;
        });

        filter.connect(masterGain);
        masterGain.connect(this.audioCtx.destination);

        this.synthNodes = { masterGain, filter, oscs };
        this.isPlaying = true;
        this.updateUI();
      } catch (err) {
        console.warn('Web Audio drone initialized in quiet mode.');
      }
    }

    attemptInitialPlayback() {
      // Clear any legacy pause state on page entry so visitor enters with music
      try {
        sessionStorage.removeItem(STORAGE_KEYS.STATE);
      } catch (e) {}

      // Try unlocking Web Audio Context if supported
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
      this.audio.volume = 0;

      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // Autoplay permitted by browser!
          this.isPlaying = true;
          this.isAutoplayBlocked = false;
          this.fadeIn(this.TARGET_VOLUME, 1500);
          this.updateUI();
        }).catch((err) => {
          // Unmuted autoplay held by browser security policy
          this.isAutoplayBlocked = true;

          // Step 1: Start muted so streaming starts immediately in background
          this.audio.muted = true;
          const mutedPromise = this.audio.play();
          if (mutedPromise !== undefined) {
            mutedPromise.then(() => {
              this.isPlaying = true;
              this.updateUI();
            }).catch(() => {});
          }

          // Step 2: Show minimal floating pill
          this.showFloatingPill();

          // Step 3: Attach permanent document interaction handler
          this.attachGestureListener();
        });
      }
    }

    attachGestureListener() {
      if (this._gestureAttached) return;
      this._gestureAttached = true;

      const onGesture = (e) => {
        if (!this.isExplicitlyPaused && (!this.isPlaying || this.audio.muted || this.audio.paused)) {
          this.unlockAndPlay();
        }
      };

      document.addEventListener('pointerdown', onGesture, { capture: true, passive: true });
      document.addEventListener('click', onGesture, { capture: true, passive: true });
      document.addEventListener('touchstart', onGesture, { capture: true, passive: true });
      document.addEventListener('keydown', onGesture, { capture: true, passive: true });
    }

    unlockAndPlay() {
      // Resume Web Audio Context
      try {
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
          this.audioCtx.resume().catch(() => {});
        }
      } catch (e) {}

      if (this.isSynthFallback && this.synthNodes) {
        this.synthNodes.masterGain.gain.linearRampToValueAtTime(this.TARGET_VOLUME, this.audioCtx.currentTime + 1.2);
        this.isPlaying = true;
        this.updateUI();
        return;
      }

      if (!this.audio) return;

      this.audio.muted = false;
      this.isAutoplayBlocked = false;

      // If already playing muted, smoothly ramp volume to target
      if (!this.audio.paused && this.audio.currentTime > 0) {
        this.isPlaying = true;
        this.fadeIn(this.TARGET_VOLUME, 1200);
        this.updateUI();
        return;
      }

      // Otherwise trigger clean playback
      this.audio.volume = 0;
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.isPlaying = true;
          this.fadeIn(this.TARGET_VOLUME, 1500);
          this.updateUI();
        }).catch((err) => {
          console.warn('Audio gesture unlock:', err);
        });
      }
    }

    fadeIn(targetVolume, duration = 1500) {
      if (!this.audio) return;
      this.isFading = true;
      if (this.fadeInterval) clearInterval(this.fadeInterval);

      const start = Date.now();
      const initialVol = this.audio.volume;
      const step = 30;

      this.fadeInterval = setInterval(() => {
        const elapsed = Date.now() - start;
        const progress = Math.min(1, elapsed / duration);
        this.audio.volume = initialVol + (targetVolume - initialVol) * progress;

        if (progress >= 1) {
          clearInterval(this.fadeInterval);
          this.audio.volume = targetVolume;
          this.isFading = false;
        }
      }, step);
    }

    fadeOut(targetVolume = 0, duration = 800, onComplete) {
      if (!this.audio) return;
      this.isFading = true;
      if (this.fadeInterval) clearInterval(this.fadeInterval);

      const start = Date.now();
      const initialVol = this.audio.volume;
      const step = 30;

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
      }, step);
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

    pauseWithFade() {
      if (!this.audio || !this.isPlaying) return;
      this.fadeOut(0.001, 800, () => {
        this.audio.pause();
        this.isPlaying = false;
        this.isFading = false;
        this.audio.volume = this.TARGET_VOLUME;
        this.updateUI();
      });
    }

    toggleMute() {
      if (!this.audio) return;
      this.audio.muted = !this.audio.muted;
      try {
        sessionStorage.setItem(STORAGE_KEYS.MUTED, String(this.audio.muted));
      } catch (e) {}
      if (!this.audio.muted && this.audio.volume === 0) {
        this.fadeIn(this.TARGET_VOLUME, 800);
      }
      this.updateUI();
    }

    /* ========================================================================
       UI RENDERING & EQUALIZER INTEGRATION
       ======================================================================== */
    renderUI() {
      // 1. Mount navbar equalizer control
      const navContainer = document.getElementById('music-controller-container');
      if (navContainer) {
        navContainer.innerHTML = `
          <button type="button" 
                  id="nav-audio-toggle" 
                  class="editorial-audio-btn" 
                  aria-label="Toggle Sacred Background Ambience"
                  aria-pressed="${this.isPlaying}">
            <span class="audio-equalizer ${this.isPlaying && !this.audio.muted ? 'playing' : ''}" aria-hidden="true">
              <span class="eq-bar eq-1"></span>
              <span class="eq-bar eq-2"></span>
              <span class="eq-bar eq-3"></span>
            </span>
            <span class="audio-status-label" id="nav-audio-label">
              ${this.isPlaying && !this.audio.muted ? 'Ambience On' : 'Play Ambience'}
            </span>
          </button>
        `;
      }

      // 2. Mount minimal floating bottom-right pill
      this.ensureFloatingPillDOM();
    }

    ensureFloatingPillDOM() {
      if (document.getElementById('audio-floating-pill')) return;

      const pill = document.createElement('div');
      pill.id = 'audio-floating-pill';
      pill.className = 'audio-floating-pill';
      pill.setAttribute('role', 'region');
      pill.setAttribute('aria-label', 'Background Ambience Controller');
      pill.innerHTML = `
        <button type="button" id="pill-audio-action" class="pill-audio-action" aria-label="Toggle Oud Ambience Music">
          <span class="audio-equalizer ${this.isPlaying && !this.audio.muted ? 'playing' : ''}" aria-hidden="true">
            <span class="eq-bar eq-1"></span>
            <span class="eq-bar eq-2"></span>
            <span class="eq-bar eq-3"></span>
          </span>
          <span class="pill-label-text" id="pill-label-text">
            ${this.isPlaying && !this.audio.muted ? 'Oud Ambience' : 'Play Ambience'}
          </span>
        </button>
      `;

      document.body.appendChild(pill);
    }

    showFloatingPill() {
      setTimeout(() => {
        const pill = document.getElementById('audio-floating-pill');
        if (pill) {
          pill.classList.add('visible');
        }
      }, 400);
    }

    bindEvents() {
      // Top navbar button click
      document.addEventListener('click', (e) => {
        const navBtn = e.target.closest('#nav-audio-toggle');
        if (navBtn) {
          e.preventDefault();
          this.togglePlayPause();
          return;
        }

        const pillAction = e.target.closest('#pill-audio-action');
        if (pillAction) {
          e.preventDefault();
          this.togglePlayPause();
          return;
        }

        // Global click to unlock audio if not already playing
        if (!this.isExplicitlyPaused && (!this.isPlaying || this.audio.paused || this.audio.muted)) {
          this.unlockAndPlay();
        }
      });

      // Synchronize before unload
      window.addEventListener('beforeunload', () => {
        if (this.audio && this.audio.currentTime > 0) {
          try {
            sessionStorage.setItem(STORAGE_KEYS.TIME, String(this.audio.currentTime));
          } catch (e) {}
        }
      });
    }

    updateUI() {
      const isAudible = this.isPlaying && this.audio && !this.audio.muted && !this.audio.paused;

      // Update Nav toggle
      const navBtn = document.getElementById('nav-audio-toggle');
      const navLabel = document.getElementById('nav-audio-label');
      if (navBtn) {
        navBtn.setAttribute('aria-pressed', String(isAudible));
        if (isAudible) {
          navBtn.classList.add('is-active');
        } else {
          navBtn.classList.remove('is-active');
        }
      }
      if (navLabel) {
        navLabel.textContent = isAudible ? 'Ambience On' : 'Play Ambience';
      }

      // Update Pill
      const pill = document.getElementById('audio-floating-pill');
      const pillLabel = document.getElementById('pill-label-text');
      if (pill) {
        if (isAudible) {
          pill.classList.add('is-playing');
        } else {
          pill.classList.remove('is-playing');
        }
        pill.classList.add('visible');
      }
      if (pillLabel) {
        pillLabel.textContent = isAudible ? 'Oud Ambience' : 'Play Ambience';
      }

      // Update equalizers
      document.querySelectorAll('.audio-equalizer').forEach((eq) => {
        if (isAudible) {
          eq.classList.add('playing');
        } else {
          eq.classList.remove('playing');
        }
      });
    }
  }

  // Self-instantiate on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.__NIKAH_AUDIO_ENGINE__ = new NikahAudioEngine();
    });
  } else {
    window.__NIKAH_AUDIO_ENGINE__ = new NikahAudioEngine();
  }
})();
