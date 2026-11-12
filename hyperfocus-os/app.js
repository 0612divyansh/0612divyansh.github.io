/* ==========================================================================
   HYPERFOCUS OS — CORE SPATIAL PRODUCTIVITY ENGINE
   Zero-dependency Web Audio Synthesizer, Matrix, Markdown & Velocity Analytics
   ========================================================================== */

(() => {
  'use strict';

  const STORAGE_KEY = 'hyperfocus_os_state_v1';
  const RING_CIRCUMFERENCE = 2 * Math.PI * 96;

  const CATEGORY_COLORS = {
    Engineering: '#10b981',
    Research: '#06b6d4',
    Design: '#8b5cf6',
    Strategy: '#f59e0b'
  };

  const PRESETS = {
    forest: {
      label: 'Forest Cabin',
      rain: 55,
      wind: 38,
      brown: 28,
      binaural: 25,
      pad: 22,
      band: 10
    },
    deepcode: {
      label: 'Deep Code 40Hz',
      rain: 20,
      wind: 10,
      brown: 45,
      binaural: 48,
      pad: 15,
      band: 40
    },
    library: {
      label: 'Warm Brown',
      rain: 10,
      wind: 12,
      brown: 72,
      binaural: 12,
      pad: 8,
      band: 14
    },
    nightsynth: {
      label: 'Night Pad',
      rain: 30,
      wind: 25,
      brown: 20,
      binaural: 30,
      pad: 58,
      band: 6
    }
  };

  /* ------------------------------------------------------------------------
     1. PROCEDURAL BIOPHILIC SOUND SYNTHESIZER (WEB AUDIO API)
     ------------------------------------------------------------------------ */
  class BiophilicSoundEngine {
    constructor() {
      this.ctx = null;
      this.isRunning = false;
      this.isMuted = false;
      this.masterVolume = 0.7;
      this.binauralBeatHz = 10;
      this.channelLevels = {
        rain: 0.55,
        wind: 0.35,
        brown: 0.30,
        binaural: 0.25,
        pad: 0.20
      };
      this.nodes = {};
      this.analyser = null;
      this.freqData = null;
      this.rainDropInterval = null;
    }

    initContext() {
      if (this.ctx) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : this.masterVolume;

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 128;
      this.freqData = new Uint8Array(this.analyser.frequencyBinCount);

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      this._buildNoiseChannels();
      this._buildBinauralChannel();
      this._buildPadChannel();
    }

    _createNoiseBuffer(type = 'pink', seconds = 4) {
      const rate = this.ctx.sampleRate;
      const length = rate * seconds;
      const buffer = this.ctx.createBuffer(1, length, rate);
      const data = buffer.getChannelData(0);

      if (type === 'brown') {
        let lastOut = 0;
        for (let i = 0; i < length; i++) {
          const white = Math.random() * 2 - 1;
          lastOut = (lastOut + 0.02 * white) / 1.02;
          data[i] = lastOut * 3.2;
        }
      } else {
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < length; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
          b6 = white * 0.115926;
        }
      }
      return buffer;
    }

    _buildNoiseChannels() {
      const pinkBuf = this._createNoiseBuffer('pink', 4);
      const brownBuf = this._createNoiseBuffer('brown', 4);

      // Forest Rain
      const rainSrc = this.ctx.createBufferSource();
      rainSrc.buffer = pinkBuf;
      rainSrc.loop = true;
      const rainFilter = this.ctx.createBiquadFilter();
      rainFilter.type = 'bandpass';
      rainFilter.frequency.value = 1400;
      rainFilter.Q.value = 0.65;
      const rainGain = this.ctx.createGain();
      rainGain.gain.value = this.channelLevels.rain * 0.42;
      rainSrc.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(this.masterGain);
      rainSrc.start();

      // Alpine Wind with slow LFO sweep
      const windSrc = this.ctx.createBufferSource();
      windSrc.buffer = pinkBuf;
      windSrc.loop = true;
      const windFilter = this.ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.value = 460;
      windFilter.Q.value = 1.8;
      const windLfo = this.ctx.createOscillator();
      windLfo.frequency.value = 0.11;
      const windLfoGain = this.ctx.createGain();
      windLfoGain.gain.value = 240;
      windLfo.connect(windLfoGain);
      windLfoGain.connect(windFilter.frequency);
      const windGain = this.ctx.createGain();
      windGain.gain.value = this.channelLevels.wind * 0.36;
      windSrc.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(this.masterGain);
      windSrc.start();
      windLfo.start();

      // Deep Brown Noise
      const brownSrc = this.ctx.createBufferSource();
      brownSrc.buffer = brownBuf;
      brownSrc.loop = true;
      const brownFilter = this.ctx.createBiquadFilter();
      brownFilter.type = 'lowpass';
      brownFilter.frequency.value = 340;
      const brownGain = this.ctx.createGain();
      brownGain.gain.value = this.channelLevels.brown * 0.55;
      brownSrc.connect(brownFilter);
      brownFilter.connect(brownGain);
      brownGain.connect(this.masterGain);
      brownSrc.start();

      this.nodes.rain = rainGain;
      this.nodes.wind = windGain;
      this.nodes.brown = brownGain;
    }

    _buildBinauralChannel() {
      const baseHz = 200;
      const oscLeft = this.ctx.createOscillator();
      const oscRight = this.ctx.createOscillator();
      oscLeft.type = 'sine';
      oscRight.type = 'sine';
      oscLeft.frequency.value = baseHz;
      oscRight.frequency.value = baseHz + this.binauralBeatHz;

      const panLeft = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
      const panRight = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
      const binGain = this.ctx.createGain();
      binGain.gain.value = this.channelLevels.binaural * 0.16;

      if (panLeft && panRight) {
        panLeft.pan.value = -0.85;
        panRight.pan.value = 0.85;
        oscLeft.connect(panLeft);
        oscRight.connect(panRight);
        panLeft.connect(binGain);
        panRight.connect(binGain);
      } else {
        oscLeft.connect(binGain);
        oscRight.connect(binGain);
      }

      binGain.connect(this.masterGain);
      oscLeft.start();
      oscRight.start();

      this.nodes.binaural = binGain;
      this.binauralOscRight = oscRight;
    }

    _buildPadChannel() {
      const padGain = this.ctx.createGain();
      padGain.gain.value = this.channelLevels.pad * 0.14;
      const padFilter = this.ctx.createBiquadFilter();
      padFilter.type = 'lowpass';
      padFilter.frequency.value = 620;

      // D minor / pentatonic harmonic warmth (D3, A3, E4)
      [146.83, 220.0, 329.63].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        osc.type = idx === 0 ? 'triangle' : 'sine';
        osc.frequency.value = freq;
        const g = this.ctx.createGain();
        g.gain.value = idx === 0 ? 0.5 : 0.25;
        osc.connect(g);
        g.connect(padFilter);
        osc.start();
      });

      padFilter.connect(padGain);
      padGain.connect(this.masterGain);
      this.nodes.pad = padGain;
    }

    _triggerRainDroplet() {
      if (!this.ctx || !this.isRunning || this.isMuted || this.channelLevels.rain < 0.08) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const freq = 900 + Math.random() * 1700;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + 0.09);

      const level = 0.015 * this.channelLevels.rain;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(level, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.11);
    }

    async togglePower() {
      if (!this.ctx) {
        this.initContext();
      }
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      this.isRunning = !this.isRunning;
      this._syncMasterGain();

      if (this.isRunning && !this.rainDropInterval) {
        this.rainDropInterval = setInterval(() => {
          if (Math.random() < 0.65) this._triggerRainDroplet();
        }, 280);
      } else if (!this.isRunning && this.rainDropInterval) {
        clearInterval(this.rainDropInterval);
        this.rainDropInterval = null;
      }
      return this.isRunning;
    }

    async ensureStarted() {
      if (!this.isRunning) {
        await this.togglePower();
      }
    }

    setMute(muted) {
      this.isMuted = muted;
      this._syncMasterGain();
    }

    setMasterVolume(val01) {
      this.masterVolume = val01;
      this._syncMasterGain();
    }

    _syncMasterGain() {
      if (!this.ctx || !this.masterGain) return;
      const target = this.isRunning && !this.isMuted ? this.masterVolume : 0;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.08);
    }

    setChannelLevel(channel, val01) {
      this.channelLevels[channel] = val01;
      if (!this.ctx || !this.nodes[channel]) return;
      const multipliers = { rain: 0.42, wind: 0.36, brown: 0.55, binaural: 0.16, pad: 0.14 };
      this.nodes[channel].gain.setTargetAtTime(val01 * multipliers[channel], this.ctx.currentTime, 0.06);
    }

    setBinauralBand(hz) {
      this.binauralBeatHz = hz;
      if (this.ctx && this.binauralOscRight) {
        this.binauralOscRight.frequency.setTargetAtTime(200 + hz, this.ctx.currentTime, 0.08);
      }
    }

    playCompletionChime() {
      if (this.isMuted) return;
      if (!this.ctx) this.initContext();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const start = now + idx * 0.11;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(0.11, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.75);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.8);
      });
    }

    getSpectrumBytes() {
      if (this.analyser && this.isRunning && !this.isMuted) {
        this.analyser.getByteFrequencyData(this.freqData);
        return this.freqData;
      }
      return null;
    }
  }

  /* ------------------------------------------------------------------------
     2. SAFE MARKDOWN PARSER (XSS-SAFE ESCAPING)
     ------------------------------------------------------------------------ */
  function escapeHtml(raw) {
    return raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderInlineMarkdown(escapedText) {
    return escapedText
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  }

  function renderMarkdown(md) {
    const lines = md.replace(/\r\n/g, '\n').split('\n');
    const out = [];
    let inCode = false;
    let codeLines = [];
    let inList = false;

    const closeList = () => {
      if (inList) {
        out.push('</ul>');
        inList = false;
      }
    };

    for (const rawLine of lines) {
      if (rawLine.trim().startsWith('```')) {
        closeList();
        if (!inCode) {
          inCode = true;
          codeLines = [];
        } else {
          out.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
          inCode = false;
        }
        continue;
      }

      if (inCode) {
        codeLines.push(rawLine);
        continue;
      }

      const trimmed = rawLine.trim();
      if (!trimmed) {
        closeList();
        continue;
      }

      const safe = escapeHtml(trimmed);

      if (trimmed.startsWith('### ')) {
        closeList();
        out.push(`<h3>${renderInlineMarkdown(safe.slice(4))}</h3>`);
      } else if (trimmed.startsWith('## ')) {
        closeList();
        out.push(`<h2>${renderInlineMarkdown(safe.slice(3))}</h2>`);
      } else if (trimmed.startsWith('# ')) {
        closeList();
        out.push(`<h1>${renderInlineMarkdown(safe.slice(2))}</h1>`);
      } else if (trimmed.startsWith('> ')) {
        closeList();
        out.push(`<blockquote>${renderInlineMarkdown(safe.slice(2))}</blockquote>`);
      } else if (/^[-*]\s+\[(x|X| )\]\s+/.test(trimmed)) {
        if (!inList) {
          out.push('<ul>');
          inList = true;
        }
        const checked = /^[-*]\s+\[(x|X)\]/.test(trimmed);
        const body = escapeHtml(trimmed.replace(/^[-*]\s+\[(x|X| )\]\s+/, ''));
        out.push(`<li>${checked ? '✅' : '⬜'} ${renderInlineMarkdown(body)}</li>`);
      } else if (/^[-*]\s+/.test(trimmed)) {
        if (!inList) {
          out.push('<ul>');
          inList = true;
        }
        const body = escapeHtml(trimmed.replace(/^[-*]\s+/, ''));
        out.push(`<li>${renderInlineMarkdown(body)}</li>`);
      } else if (/^---+$/.test(trimmed)) {
        closeList();
        out.push('<hr>');
      } else {
        closeList();
        out.push(`<p>${renderInlineMarkdown(safe)}</p>`);
      }
    }

    if (inCode) {
      out.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
    }
    closeList();
    return out.join('\n');
  }

  /* ------------------------------------------------------------------------
     3. DEFAULT SEED DATA & STATE PERSISTENCE
     ------------------------------------------------------------------------ */
  function createDefaultState() {
    return {
      activeTaskId: 't-1',
      streakDays: 6,
      dailyMinutes: [135, 160, 195, 150, 210, 175, 95],
      tasks: [
        { id: 't-1', title: 'Architect Web Audio biophilic synth & spectrum DSP', quadrant: 'q1', category: 'Engineering', done: false },
        { id: 't-2', title: 'Ship Cycle 3 HyperFocus OS repository & Pages CI', quadrant: 'q1', category: 'Engineering', done: false },
        { id: 't-3', title: 'Design 90-minute ultradian cognitive flow protocol', quadrant: 'q2', category: 'Research', done: false },
        { id: 't-4', title: 'Refine spatial glassmorphism & Canvas HiDPI charts', quadrant: 'q2', category: 'Design', done: false },
        { id: 't-5', title: 'Batch inbox triage & dependency audit updates', quadrant: 'q3', category: 'Strategy', done: false },
        { id: 't-6', title: 'Archive low-priority social feed bookmarks', quadrant: 'q4', category: 'Strategy', done: true }
      ],
      notes: [
        {
          id: 'n-1',
          title: 'Session Brief',
          content: `# HyperFocus OS — Deep-Work Brief\n\n> "Clarity comes from isolating high-leverage Q1/Q2 work inside a calm sensory environment."\n\n## Today's Cognitive Objective\n- [x] Initialize procedural **Web Audio** soundscape\n- [ ] Complete a **50m Ultradian block** on Q1 Architecture\n- [ ] Synthesize key insights below\n\n## Architecture Scratchpad\n\`\`\`js\n// 40Hz Gamma entrainment = 200Hz L + 240Hz R\nconst flowState = { mode: 'ultradian', noise: 'biophilic' };\n\`\`\`\n`
        },
        {
          id: 'n-2',
          title: 'Research Log',
          content: `# Biophilic Acoustics & Attention\n\n- **Brown noise** attenuates sudden ambient speech transients.\n- **10Hz Alpha** supports relaxed creative synthesis.\n- **40Hz Gamma** pairs well with algorithmic debugging sprints.\n\n---\n\nAdd your own markdown notes here — everything auto-saves to \`localStorage\`.`
        }
      ],
      activeNoteId: 'n-1',
      sessions: [
        { id: 's-1', task: 'Architect Web Audio biophilic synth', category: 'Engineering', mins: 50, at: 'Today, 14:20' },
        { id: 's-2', task: 'Refine spatial glassmorphism layout', category: 'Design', mins: 25, at: 'Today, 11:05' },
        { id: 's-3', task: 'Ultradian cognitive flow study', category: 'Research', mins: 45, at: 'Yesterday' }
      ]
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createDefaultState();
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed.tasks) || !Array.isArray(parsed.notes)) {
        return createDefaultState();
      }
      return parsed;
    } catch {
      return createDefaultState();
    }
  }

  /* ------------------------------------------------------------------------
     4. MAIN APPLICATION CONTROLLER
     ------------------------------------------------------------------------ */
  class HyperFocusApp {
    constructor() {
      this.state = loadState();
      this.audio = new BiophilicSoundEngine();

      this.timerMode = 'focus';
      this.totalSeconds = 25 * 60;
      this.remainingSeconds = 25 * 60;
      this.timerRunning = false;
      this.timerInterval = null;
      this.draggedTaskId = null;

      this.cacheElements();
      this.bindEvents();
      this.renderAll();
      this.startVisualizerLoop();
    }

    saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch {
        // Ignore storage quota issues gracefully
      }
    }

    cacheElements() {
      this.el = {
        osMain: document.getElementById('os-main'),
        navTabs: document.querySelectorAll('.nav-tab'),
        activeTargetName: document.getElementById('active-target-name'),
        headerFocusMins: document.getElementById('header-focus-mins'),
        headerStreak: document.getElementById('header-streak'),
        btnZenMode: document.getElementById('btn-zen-mode'),
        btnMasterAudio: document.getElementById('btn-master-audio'),
        audioStatusIcon: document.getElementById('audio-status-icon'),
        btnCommandPalette: document.getElementById('btn-command-palette'),

        // Timer
        modePills: document.querySelectorAll('.mode-pill'),
        timerDisplay: document.getElementById('timer-display'),
        timerPhaseLabel: document.getElementById('timer-phase-label'),
        timerStateBadge: document.getElementById('timer-state-badge'),
        timerRingProgress: document.getElementById('timer-ring-progress'),
        btnTimerToggle: document.getElementById('btn-timer-toggle'),
        timerToggleIcon: document.getElementById('timer-toggle-icon'),
        timerToggleText: document.getElementById('timer-toggle-text'),
        btnTimerReset: document.getElementById('btn-timer-reset'),
        btnTimerComplete: document.getElementById('btn-timer-complete'),

        // Synth
        btnSynthPower: document.getElementById('btn-synth-power'),
        synthPowerLabel: document.getElementById('synth-power-label'),
        spectrumCanvas: document.getElementById('audio-spectrum-canvas'),
        activePresetBadge: document.getElementById('active-preset-badge'),
        masterVolume: document.getElementById('master-volume'),
        presetChips: document.querySelectorAll('.preset-chip'),
        channelSliders: document.querySelectorAll('.channel-slider'),
        binauralBand: document.getElementById('binaural-band'),
        binauralFreqLabel: document.getElementById('binaural-freq-label'),

        // Matrix
        taskComposer: document.getElementById('task-composer'),
        taskInput: document.getElementById('task-input'),
        taskQuadrant: document.getElementById('task-quadrant'),
        taskCategory: document.getElementById('task-category'),
        matrixTaskCount: document.getElementById('matrix-task-count'),
        btnClearDone: document.getElementById('btn-clear-done'),
        quadrantLists: {
          q1: document.getElementById('list-q1'),
          q2: document.getElementById('list-q2'),
          q3: document.getElementById('list-q3'),
          q4: document.getElementById('list-q4')
        },
        quadrantBoxes: document.querySelectorAll('.quadrant-box'),

        // Notes
        noteTabs: document.getElementById('note-tabs'),
        btnNewNote: document.getElementById('btn-new-note'),
        splitBtns: document.querySelectorAll('.split-btn'),
        notesWorkspace: document.getElementById('notes-workspace'),
        markdownEditor: document.getElementById('markdown-editor'),
        markdownPreview: document.getElementById('markdown-preview'),
        noteStats: document.getElementById('note-stats'),
        btnExportMd: document.getElementById('btn-export-md'),

        // Analytics
        kpiVelocityScore: document.getElementById('kpi-velocity-score'),
        kpiWeeklyHours: document.getElementById('kpi-weekly-hours'),
        kpiSessionsCount: document.getElementById('kpi-sessions-count'),
        kpiFocusRatio: document.getElementById('kpi-focus-ratio'),
        kpiTasksDone: document.getElementById('kpi-tasks-done'),
        velocityCanvas: document.getElementById('velocity-chart-canvas'),
        allocationCanvas: document.getElementById('allocation-chart-canvas'),
        allocationLegend: document.getElementById('allocation-legend'),
        sessionLog: document.getElementById('session-log'),
        btnExportSnapshot: document.getElementById('btn-export-snapshot'),
        btnExportJson: document.getElementById('btn-export-json'),
        btnResetDemo: document.getElementById('btn-reset-demo'),

        // Zen & Command Dialog
        zenOverlay: document.getElementById('zen-overlay'),
        zenTargetName: document.getElementById('zen-target-name'),
        zenTimerDisplay: document.getElementById('zen-timer-display'),
        btnZenToggle: document.getElementById('btn-zen-toggle'),
        btnZenAudio: document.getElementById('btn-zen-audio'),
        btnZenExit: document.getElementById('btn-zen-exit'),
        commandDialog: document.getElementById('command-dialog'),
        cmdSearch: document.getElementById('cmd-search'),
        cmdList: document.getElementById('cmd-list'),
        cmdClose: document.getElementById('cmd-close'),
        toastContainer: document.getElementById('toast-container')
      };
    }

    bindEvents() {
      // Navigation views
      this.el.navTabs.forEach((tab) => {
        tab.addEventListener('click', () => this.setView(tab.dataset.view));
      });

      // Timer modes & controls
      this.el.modePills.forEach((pill) => {
        pill.addEventListener('click', () => {
          this.setTimerMode(pill.dataset.mode, Number(pill.dataset.mins));
        });
      });

      this.el.btnTimerToggle.addEventListener('click', () => this.toggleTimer());
      this.el.btnTimerReset.addEventListener('click', () => this.resetTimer());
      this.el.btnTimerComplete.addEventListener('click', () => this.completeFocusSession(true));

      // Sound Synthesizer
      this.el.btnSynthPower.addEventListener('click', () => this.toggleAudioEngine());
      this.el.btnMasterAudio.addEventListener('click', () => this.toggleMasterMute());
      this.el.masterVolume.addEventListener('input', (e) => {
        this.audio.setMasterVolume(Number(e.target.value) / 100);
      });

      this.el.presetChips.forEach((chip) => {
        chip.addEventListener('click', () => this.applySoundPreset(chip.dataset.preset));
      });

      this.el.channelSliders.forEach((slider) => {
        slider.addEventListener('input', (e) => {
          const ch = e.target.dataset.channel;
          const pct = Number(e.target.value);
          this.audio.setChannelLevel(ch, pct / 100);
          const label = document.getElementById(`val-${ch}`);
          if (label) label.textContent = `${pct}%`;
        });
      });

      this.el.binauralBand.addEventListener('change', (e) => {
        const hz = Number(e.target.value);
        this.audio.setBinauralBand(hz);
        const names = { 40: '40Hz Gamma Peak', 14: '14Hz Beta Alert', 10: '10Hz Alpha Flow', 6: '6Hz Theta Insight' };
        this.el.binauralFreqLabel.textContent = `${names[hz] || hz + 'Hz'} (200/${200 + hz}Hz)`;
      });

      // Matrix Task Composer & Drag-Drop
      this.el.taskComposer.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = this.el.taskInput.value.trim();
        if (!title) return;
        const newTask = {
          id: `t-${Date.now()}`,
          title,
          quadrant: this.el.taskQuadrant.value,
          category: this.el.taskCategory.value,
          done: false
        };
        this.state.tasks.unshift(newTask);
        if (!this.state.activeTaskId) this.state.activeTaskId = newTask.id;
        this.el.taskInput.value = '';
        this.saveState();
        this.renderMatrix();
        this.renderAnalytics();
        this.toast(`Added "${title}" to ${newTask.quadrant.toUpperCase()}`);
      });

      this.el.btnClearDone.addEventListener('click', () => {
        const before = this.state.tasks.length;
        this.state.tasks = this.state.tasks.filter((t) => !t.done);
        if (this.state.tasks.length !== before) {
          this.saveState();
          this.renderMatrix();
          this.renderAnalytics();
          this.toast('Cleared completed tasks');
        }
      });

      this.el.quadrantBoxes.forEach((box) => {
        box.addEventListener('dragover', (e) => {
          e.preventDefault();
          box.classList.add('is-dragover');
        });
        box.addEventListener('dragleave', () => box.classList.remove('is-dragover'));
        box.addEventListener('drop', (e) => {
          e.preventDefault();
          box.classList.remove('is-dragover');
          if (!this.draggedTaskId) return;
          const task = this.state.tasks.find((t) => t.id === this.draggedTaskId);
          if (task && task.quadrant !== box.dataset.quadrant) {
            task.quadrant = box.dataset.quadrant;
            this.saveState();
            this.renderMatrix();
            this.renderAnalytics();
          }
          this.draggedTaskId = null;
        });
      });

      // Split Markdown Notes
      this.el.markdownEditor.addEventListener('input', () => {
        const note = this.getActiveNote();
        if (!note) return;
        note.content = this.el.markdownEditor.value;
        this.saveState();
        this.renderMarkdownPreview();
      });

      this.el.splitBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          this.el.splitBtns.forEach((b) => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          this.el.notesWorkspace.dataset.split = btn.dataset.split;
        });
      });

      this.el.btnNewNote.addEventListener('click', () => {
        const num = this.state.notes.length + 1;
        const note = {
          id: `n-${Date.now()}`,
          title: `Note ${num}`,
          content: `# Note ${num}\n\nCapture architecture decisions, session takeaways, or meeting synthesis here.\n`
        };
        this.state.notes.push(note);
        this.state.activeNoteId = note.id;
        this.saveState();
        this.renderNotes();
      });

      this.el.btnExportMd.addEventListener('click', () => {
        const note = this.getActiveNote();
        if (!note) return;
        const slug = note.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        this.downloadBlob(new Blob([note.content], { type: 'text/markdown' }), `${slug}.md`);
        this.toast(`Exported ${slug}.md`);
      });

      // Analytics exports & reset
      this.el.btnExportSnapshot.addEventListener('click', () => this.exportVelocitySnapshot());
      this.el.btnExportJson.addEventListener('click', () => {
        this.downloadBlob(
          new Blob([JSON.stringify(this.state, null, 2)], { type: 'application/json' }),
          'hyperfocus-os-backup.json'
        );
        this.toast('Downloaded JSON workspace backup');
      });
      this.el.btnResetDemo.addEventListener('click', () => {
        this.state = createDefaultState();
        this.saveState();
        this.renderAll();
        this.toast('Restored default demo workspace');
      });

      // Zen Mode
      this.el.btnZenMode.addEventListener('click', () => this.toggleZenMode(true));
      this.el.btnZenExit.addEventListener('click', () => this.toggleZenMode(false));
      this.el.btnZenToggle.addEventListener('click', () => this.toggleTimer());
      this.el.btnZenAudio.addEventListener('click', () => this.toggleAudioEngine());

      // Command Palette
      this.el.btnCommandPalette.addEventListener('click', () => this.openCommandPalette());
      this.el.cmdClose.addEventListener('click', () => this.el.commandDialog.close());
      this.el.cmdSearch.addEventListener('input', () => this.renderCommandList());

      // Global Shortcuts & Resize
      window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          this.openCommandPalette();
          return;
        }
        if (e.key === 'Escape' && !this.el.zenOverlay.hidden) {
          this.toggleZenMode(false);
          return;
        }
        const activeTag = document.activeElement ? document.activeElement.tagName : '';
        if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') return;

        if (e.code === 'Space') {
          e.preventDefault();
          this.toggleTimer();
        } else if (e.key.toLowerCase() === 'm') {
          this.toggleMasterMute();
        } else if (e.key.toLowerCase() === 'z') {
          this.toggleZenMode(this.el.zenOverlay.hidden);
        }
      });

      window.addEventListener('resize', () => this.renderCharts());
    }

    setView(view) {
      this.el.osMain.dataset.activeView = view;
      this.el.navTabs.forEach((t) => t.classList.toggle('is-active', t.dataset.view === view));
      requestAnimationFrame(() => this.renderCharts());
    }

    /* ---------------- Timer Logic ---------------- */
    setTimerMode(mode, mins) {
      this.pauseTimer();
      this.timerMode = mode;
      this.totalSeconds = mins * 60;
      this.remainingSeconds = mins * 60;

      const labels = {
        focus: 'Pomodoro Deep Work (25m)',
        ultradian: 'Ultradian Flow Block (50m)',
        short: 'Biophilic Recovery Break (5m)',
        long: 'Deep Neural Reset (15m)'
      };
      this.el.timerPhaseLabel.textContent = labels[mode] || 'Focus Session';
      this.el.modePills.forEach((p) => p.classList.toggle('is-active', p.dataset.mode === mode));
      this.renderTimer();
    }

    toggleTimer() {
      if (this.timerRunning) {
        this.pauseTimer();
      } else {
        this.startTimer();
      }
    }

    startTimer() {
      if (this.timerRunning) return;
      this.timerRunning = true;
      this.el.timerToggleIcon.textContent = '⏸';
      this.el.timerToggleText.textContent = 'Pause';
      this.el.timerStateBadge.textContent = 'IN DEEP FLOW • LIVE';

      this.timerInterval = setInterval(() => {
        if (this.remainingSeconds > 0) {
          this.remainingSeconds -= 1;
          this.renderTimer();
        } else {
          this.completeFocusSession(false);
        }
      }, 1000);
    }

    pauseTimer() {
      this.timerRunning = false;
      clearInterval(this.timerInterval);
      this.timerInterval = null;
      this.el.timerToggleIcon.textContent = '▶';
      this.el.timerToggleText.textContent = 'Start Focus';
      this.el.timerStateBadge.textContent = 'PAUSED';
    }

    resetTimer() {
      this.pauseTimer();
      this.remainingSeconds = this.totalSeconds;
      this.el.timerStateBadge.textContent = 'READY TO ENTER FLOW';
      this.renderTimer();
    }

    completeFocusSession(manual) {
      this.pauseTimer();
      const elapsedSec = manual
        ? Math.max(60, this.totalSeconds - this.remainingSeconds)
        : this.totalSeconds;
      const loggedMins = Math.max(1, Math.round(elapsedSec / 60));

      if (this.timerMode === 'focus' || this.timerMode === 'ultradian') {
        const activeTask = this.getActiveTask();
        const todayIdx = this.state.dailyMinutes.length - 1;
        this.state.dailyMinutes[todayIdx] += loggedMins;
        this.state.sessions.unshift({
          id: `s-${Date.now()}`,
          task: activeTask ? activeTask.title : 'Deep Work Session',
          category: activeTask ? activeTask.category : 'Engineering',
          mins: loggedMins,
          at: 'Just now'
        });
        this.state.sessions = this.state.sessions.slice(0, 12);
        this.saveState();
        this.renderAnalytics();
        this.toast(`Logged ${loggedMins}m deep-work session!`);
      } else {
        this.toast('Recovery break complete — ready for next block');
      }

      this.audio.playCompletionChime();
      this.remainingSeconds = this.totalSeconds;
      this.el.timerStateBadge.textContent = 'SESSION COMPLETE';
      this.renderTimer();
    }

    renderTimer() {
      const mins = Math.floor(this.remainingSeconds / 60);
      const secs = this.remainingSeconds % 60;
      const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      this.el.timerDisplay.textContent = formatted;
      this.el.zenTimerDisplay.textContent = formatted;

      const progress = this.totalSeconds > 0 ? this.remainingSeconds / this.totalSeconds : 1;
      const offset = RING_CIRCUMFERENCE * (1 - progress);
      this.el.timerRingProgress.style.strokeDashoffset = String(offset);
    }

    /* ---------------- Biophilic Audio Controls ---------------- */
    async toggleAudioEngine() {
      const running = await this.audio.togglePower();
      this.el.btnSynthPower.classList.toggle('is-on', running);
      this.el.btnSynthPower.setAttribute('aria-pressed', String(running));
      this.el.synthPowerLabel.textContent = running ? 'Engine Live' : 'Start Audio';
      this.el.audioStatusIcon.textContent = running && !this.audio.isMuted ? '🔊' : '🔇';
    }

    async toggleMasterMute() {
      if (!this.audio.isRunning) {
        await this.toggleAudioEngine();
        return;
      }
      this.audio.setMute(!this.audio.isMuted);
      this.el.audioStatusIcon.textContent = this.audio.isMuted ? '🔇' : '🔊';
      this.toast(this.audio.isMuted ? 'Soundscape muted' : 'Soundscape unmuted');
    }

    async applySoundPreset(key) {
      const p = PRESETS[key];
      if (!p) return;
      await this.audio.ensureStarted();
      this.el.btnSynthPower.classList.add('is-on');
      this.el.btnSynthPower.setAttribute('aria-pressed', 'true');
      this.el.synthPowerLabel.textContent = 'Engine Live';
      this.el.audioStatusIcon.textContent = this.audio.isMuted ? '🔇' : '🔊';

      this.el.presetChips.forEach((c) => c.classList.toggle('is-active', c.dataset.preset === key));
      this.el.activePresetBadge.textContent = `Preset: ${p.label}`;

      ['rain', 'wind', 'brown', 'binaural', 'pad'].forEach((ch) => {
        const slider = document.querySelector(`.channel-slider[data-channel="${ch}"]`);
        const label = document.getElementById(`val-${ch}`);
        if (slider) slider.value = String(p[ch]);
        if (label) label.textContent = `${p[ch]}%`;
        this.audio.setChannelLevel(ch, p[ch] / 100);
      });

      this.el.binauralBand.value = String(p.band);
      this.el.binauralBand.dispatchEvent(new Event('change'));
      this.toast(`Soundscape switched to ${p.label}`);
    }

    startVisualizerLoop() {
      const canvas = this.el.spectrumCanvas;
      const ctx = canvas.getContext('2d');
      let phase = 0;

      const draw = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const w = Math.max(10, Math.floor(rect.width * dpr));
        const h = Math.max(10, Math.floor(rect.height * dpr));
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }

        ctx.clearRect(0, 0, w, h);
        const bytes = this.audio.getSpectrumBytes();
        const bars = 36;
        const gap = 3 * dpr;
        const barW = (w - gap * (bars + 1)) / bars;

        phase += 0.04;
        for (let i = 0; i < bars; i++) {
          let ratio;
          if (bytes) {
            const idx = Math.min(bytes.length - 1, Math.floor((i / bars) * (bytes.length * 0.75)));
            ratio = Math.max(0.08, bytes[idx] / 255);
          } else {
            ratio = 0.1 + 0.14 * (0.5 + 0.5 * Math.sin(phase + i * 0.35));
          }
          const barH = ratio * (h * 0.72);
          const x = gap + i * (barW + gap);
          const y = h - barH - 4 * dpr;

          const grad = ctx.createLinearGradient(0, y, 0, h);
          grad.addColorStop(0, '#10b981');
          grad.addColorStop(0.6, '#06b6d4');
          grad.addColorStop(1, 'rgba(139, 92, 246, 0.35)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, y, barW, barH, 3 * dpr);
          ctx.fill();
        }
        requestAnimationFrame(draw);
      };
      requestAnimationFrame(draw);
    }

    /* ---------------- Matrix Logic ---------------- */
    getActiveTask() {
      return this.state.tasks.find((t) => t.id === this.state.activeTaskId) || null;
    }

    renderMatrix() {
      const counts = { q1: 0, q2: 0, q3: 0, q4: 0 };
      Object.values(this.el.quadrantLists).forEach((ul) => { ul.innerHTML = ''; });

      for (const task of this.state.tasks) {
        if (!counts.hasOwnProperty(task.quadrant)) continue;
        counts[task.quadrant] += 1;

        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.done) li.classList.add('is-done');
        if (task.id === this.state.activeTaskId) li.classList.add('is-active-target');
        li.draggable = true;
        li.dataset.taskId = task.id;

        li.addEventListener('dragstart', () => {
          this.draggedTaskId = task.id;
        });

        const check = document.createElement('input');
        check.type = 'checkbox';
        check.className = 'task-check';
        check.checked = task.done;
        check.setAttribute('aria-label', `Mark "${task.title}" complete`);
        check.addEventListener('change', () => {
          task.done = check.checked;
          this.saveState();
          this.renderMatrix();
          this.renderAnalytics();
        });

        const body = document.createElement('div');
        body.className = 'task-body';
        const text = document.createElement('div');
        text.className = 'task-text';
        text.textContent = task.title;
        const meta = document.createElement('div');
        meta.className = 'task-meta';
        const cat = document.createElement('span');
        cat.className = 'task-cat';
        cat.textContent = task.category;
        meta.appendChild(cat);
        body.appendChild(text);
        body.appendChild(meta);

        const actions = document.createElement('div');
        actions.className = 'task-actions';

        const focusBtn = document.createElement('button');
        focusBtn.type = 'button';
        focusBtn.className = 'task-btn';
        focusBtn.title = 'Set as Active Focus Target';
        focusBtn.textContent = '◎';
        focusBtn.addEventListener('click', () => {
          this.state.activeTaskId = task.id;
          this.saveState();
          this.renderMatrix();
          this.renderActiveTarget();
          this.toast(`Focus locked: ${task.title}`);
        });

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'task-btn';
        delBtn.title = 'Delete Task';
        delBtn.textContent = '✕';
        delBtn.addEventListener('click', () => {
          this.state.tasks = this.state.tasks.filter((t) => t.id !== task.id);
          if (this.state.activeTaskId === task.id) {
            this.state.activeTaskId = this.state.tasks[0] ? this.state.tasks[0].id : null;
          }
          this.saveState();
          this.renderMatrix();
          this.renderActiveTarget();
          this.renderAnalytics();
        });

        actions.appendChild(focusBtn);
        actions.appendChild(delBtn);

        li.appendChild(check);
        li.appendChild(body);
        li.appendChild(actions);

        this.el.quadrantLists[task.quadrant].appendChild(li);
      }

      ['q1', 'q2', 'q3', 'q4'].forEach((q) => {
        if (counts[q] === 0) {
          const empty = document.createElement('li');
          empty.className = 'empty-quadrant';
          empty.textContent = 'Drop tasks here';
          this.el.quadrantLists[q].appendChild(empty);
        }
      });

      const activeCount = this.state.tasks.filter((t) => !t.done).length;
      this.el.matrixTaskCount.textContent = `${activeCount} active`;
      this.renderActiveTarget();
    }

    renderActiveTarget() {
      const task = this.getActiveTask();
      const name = task ? task.title : 'Select a task from Matrix';
      this.el.activeTargetName.textContent = name;
      this.el.zenTargetName.textContent = task ? task.title : 'Biophilic Deep-Work Session';
    }

    /* ---------------- Split Markdown Notes ---------------- */
    getActiveNote() {
      return this.state.notes.find((n) => n.id === this.state.activeNoteId) || this.state.notes[0] || null;
    }

    renderNotes() {
      this.el.noteTabs.innerHTML = '';
      for (const note of this.state.notes) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'note-tab';
        if (note.id === this.state.activeNoteId) btn.classList.add('is-active');
        btn.textContent = note.title;
        btn.addEventListener('click', () => {
          this.state.activeNoteId = note.id;
          this.saveState();
          this.renderNotes();
        });
        this.el.noteTabs.appendChild(btn);
      }

      const active = this.getActiveNote();
      if (active) {
        this.el.markdownEditor.value = active.content;
        this.renderMarkdownPreview();
      }
    }

    renderMarkdownPreview() {
      const text = this.el.markdownEditor.value;
      this.el.markdownPreview.innerHTML = renderMarkdown(text);
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const readMins = Math.max(1, Math.ceil(words / 200));
      this.el.noteStats.textContent = `${words} words • ${text.length} chars • ${readMins} min read`;
    }

    /* ---------------- Deep-Work Velocity Analytics ---------------- */
    renderAnalytics() {
      const todayMins = this.state.dailyMinutes[this.state.dailyMinutes.length - 1] || 0;
      const totalMins = this.state.dailyMinutes.reduce((acc, n) => acc + n, 0);
      const totalHours = (totalMins / 60).toFixed(1);

      const totalTasks = this.state.tasks.length || 1;
      const highLeverage = this.state.tasks.filter((t) => t.quadrant === 'q1' || t.quadrant === 'q2').length;
      const focusRatio = Math.round((highLeverage / totalTasks) * 100);
      const completedTasks = this.state.tasks.filter((t) => t.done).length;
      const velocityScore = Math.min(99, Math.round(62 + (totalMins / 1200) * 25 + (focusRatio / 100) * 12));

      this.el.headerFocusMins.textContent = String(todayMins);
      this.el.headerStreak.textContent = String(this.state.streakDays);
      this.el.kpiVelocityScore.textContent = String(velocityScore);
      this.el.kpiWeeklyHours.textContent = `${totalHours}h`;
      this.el.kpiSessionsCount.textContent = `${this.state.sessions.length} recent logs`;
      this.el.kpiFocusRatio.textContent = `${focusRatio}%`;
      this.el.kpiTasksDone.textContent = String(completedTasks);

      this.el.sessionLog.innerHTML = '';
      for (const s of this.state.sessions) {
        const li = document.createElement('li');
        const title = document.createElement('span');
        title.className = 'session-title';
        title.textContent = `${s.task} (${s.category})`;
        const meta = document.createElement('span');
        meta.className = 'session-meta';
        meta.textContent = `${s.mins}m • ${s.at}`;
        li.appendChild(title);
        li.appendChild(meta);
        this.el.sessionLog.appendChild(li);
      }

      this.renderCharts();
    }

    renderCharts() {
      this._drawVelocityChart();
      this._drawAllocationChart();
    }

    _drawVelocityChart() {
      const canvas = this.el.velocityCanvas;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;
      const pad = { top: 14, right: 12, bottom: 26, left: 32 };
      const plotW = w - pad.left - pad.right;
      const plotH = h - pad.top - pad.bottom;

      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
      const vals = this.state.dailyMinutes;
      const maxVal = Math.max(220, ...vals);

      // Goal Line (180m)
      const goalY = pad.top + plotH * (1 - 180 / maxVal);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(pad.left, goalY);
      ctx.lineTo(w - pad.right, goalY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#64748b';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('180m', 2, goalY + 3);

      const slotW = plotW / vals.length;
      const barW = Math.min(26, slotW * 0.54);

      vals.forEach((v, i) => {
        const barH = (v / maxVal) * plotH;
        const x = pad.left + i * slotW + (slotW - barW) / 2;
        const y = pad.top + plotH - barH;

        const grad = ctx.createLinearGradient(0, y, 0, pad.top + plotH);
        grad.addColorStop(0, i === vals.length - 1 ? '#10b981' : '#06b6d4');
        grad.addColorStop(1, 'rgba(139, 92, 246, 0.25)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, [5, 5, 0, 0]);
        ctx.fill();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(days[i], x + barW / 2, h - 8);
      });
    }

    _drawAllocationChart() {
      const canvas = this.el.allocationCanvas;
      const dpr = window.devicePixelRatio || 1;
      const size = 128;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      const counts = { Engineering: 0, Research: 0, Design: 0, Strategy: 0 };
      for (const t of this.state.tasks) {
        counts[t.category] = (counts[t.category] || 0) + 1;
      }
      const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

      const cx = size / 2;
      const cy = size / 2;
      const r = 46;
      let start = -Math.PI / 2;

      this.el.allocationLegend.innerHTML = '';

      Object.entries(counts).forEach(([cat, count]) => {
        const slice = (count / total) * Math.PI * 2;
        if (slice > 0) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, start, start + slice);
          ctx.strokeStyle = CATEGORY_COLORS[cat] || '#64748b';
          ctx.lineWidth = 14;
          ctx.stroke();
          start += slice;
        }

        const pct = Math.round((count / total) * 100);
        const li = document.createElement('li');
        li.innerHTML = `
          <span class="legend-left">
            <span class="legend-dot" style="background:${CATEGORY_COLORS[cat]}"></span>
            <span>${cat}</span>
          </span>
          <span>${pct}%</span>
        `;
        this.el.allocationLegend.appendChild(li);
      });

      ctx.fillStyle = '#f1f5f9';
      ctx.font = '700 15px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(String(this.state.tasks.length), cx, cy + 2);
      ctx.fillStyle = '#64748b';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText('tasks', cx, cy + 15);
    }

    exportVelocitySnapshot() {
      const c = document.createElement('canvas');
      c.width = 1200;
      c.height = 720;
      const ctx = c.getContext('2d');

      const bg = ctx.createLinearGradient(0, 0, 1200, 720);
      bg.addColorStop(0, '#070b12');
      bg.addColorStop(1, '#0e1928');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 1200, 720);

      ctx.fillStyle = '#10b981';
      ctx.font = '700 24px "JetBrains Mono", monospace';
      ctx.fillText('HYPERFOCUS OS • DEEP-WORK VELOCITY SNAPSHOT', 60, 75);

      ctx.fillStyle = '#f1f5f9';
      ctx.font = '800 44px Outfit, sans-serif';
      const active = this.getActiveTask();
      ctx.fillText(active ? active.title.slice(0, 48) : 'Spatial Deep-Work Session', 60, 140);

      const metrics = [
        ['VELOCITY SCORE', this.el.kpiVelocityScore.textContent, '#10b981'],
        ['WEEKLY DEEP WORK', this.el.kpiWeeklyHours.textContent, '#06b6d4'],
        ['Q1/Q2 FOCUS RATIO', this.el.kpiFocusRatio.textContent, '#8b5cf6'],
        ['ACTIVE STREAK', `${this.state.streakDays} Days`, '#f59e0b']
      ];

      metrics.forEach(([label, val, color], i) => {
        const x = 60 + i * 275;
        ctx.fillStyle = 'rgba(20, 30, 48, 0.85)';
        ctx.beginPath();
        ctx.roundRect(x, 200, 250, 150, 16);
        ctx.fill();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 15px Inter, sans-serif';
        ctx.fillText(label, x + 24, 244);

        ctx.fillStyle = color;
        ctx.font = '800 48px Outfit, sans-serif';
        ctx.fillText(val, x + 24, 312);
      });

      ctx.fillStyle = '#64748b';
      ctx.font = '18px "JetBrains Mono", monospace';
      ctx.fillText('github.com/0612divyansh/hyperfocus-os • Zero-Dependency Biophilic Productivity Suite', 60, 665);

      c.toBlob((blob) => {
        if (blob) {
          this.downloadBlob(blob, 'hyperfocus-velocity-snapshot.png');
          this.toast('Exported 1200x720 PNG Velocity Snapshot');
        }
      });
    }

    /* ---------------- Zen Mode & Command Palette ---------------- */
    toggleZenMode(show) {
      this.el.zenOverlay.hidden = !show;
      if (show) this.renderActiveTarget();
    }

    openCommandPalette() {
      this.el.cmdSearch.value = '';
      this.renderCommandList();
      if (typeof this.el.commandDialog.showModal === 'function') {
        this.el.commandDialog.showModal();
      } else {
        this.el.commandDialog.setAttribute('open', 'true');
      }
      this.el.cmdSearch.focus();
    }

    renderCommandList() {
      const q = this.el.cmdSearch.value.trim().toLowerCase();
      const commands = [
        { label: '▶ Start / Pause Focus Timer', hint: 'Space', run: () => this.toggleTimer() },
        { label: '🌿 Toggle Biophilic Sound Engine', hint: 'Audio', run: () => this.toggleAudioEngine() },
        { label: '🌲 Preset: Forest Cabin', hint: '10Hz Alpha', run: () => this.applySoundPreset('forest') },
        { label: '⚡ Preset: Deep Code 40Hz', hint: '40Hz Gamma', run: () => this.applySoundPreset('deepcode') },
        { label: '🪷 Toggle Zen Mode Chamber', hint: 'Z', run: () => this.toggleZenMode(this.el.zenOverlay.hidden) },
        { label: '🧭 View: Full Workspace', hint: 'Grid', run: () => this.setView('workspace') },
        { label: '🎯 View: Eisenhower Matrix', hint: 'Focus', run: () => this.setView('matrix') },
        { label: '📝 View: Split Markdown Notes', hint: 'Docs', run: () => this.setView('notes') },
        { label: '📊 View: Velocity Analytics', hint: 'Stats', run: () => this.setView('analytics') },
        { label: '📸 Export Velocity Snapshot PNG', hint: '1200x720', run: () => this.exportVelocitySnapshot() }
      ];

      this.el.cmdList.innerHTML = '';
      commands
        .filter((c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q))
        .forEach((cmd) => {
          const li = document.createElement('li');
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'cmd-item';
          btn.innerHTML = `<span>${cmd.label}</span><span class="cmd-shortcut">${cmd.hint}</span>`;
          btn.addEventListener('click', () => {
            this.el.commandDialog.close();
            cmd.run();
          });
          li.appendChild(btn);
          this.el.cmdList.appendChild(li);
        });
    }

    downloadBlob(blob, filename) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    toast(message) {
      const node = document.createElement('div');
      node.className = 'toast';
      node.textContent = message;
      this.el.toastContainer.appendChild(node);
      setTimeout(() => node.remove(), 3000);
    }

    renderAll() {
      this.renderTimer();
      this.renderMatrix();
      this.renderNotes();
      this.renderAnalytics();
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.hyperfocusApp = new HyperFocusApp();
  });
})();
