/**
 * PulseMetrics Mission Control — Core Orchestration Engine
 * Production-Grade Real-Time Observability & Incident War-Room
 * Zero external runtime dependencies (Vanilla ES6+ Canvas & Web Audio API)
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. WEB AUDIO SYNTHESIZER
     ========================================================================== */
  class AudioSynth {
    constructor() {
      this.ctx = null;
      this.enabled = localStorage.getItem('pm_sound_enabled') !== 'false';
      this.droneOsc = null;
      this.droneGain = null;
    }

    init() {
      if (!this.ctx && typeof window.AudioContext !== 'undefined') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('pm_sound_enabled', this.enabled.toString());
      if (this.enabled) {
        this.init();
        this.playBeep(880, 0.08, 'sine');
      }
      return this.enabled;
    }

    playClick() {
      if (!this.enabled) return;
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    }

    playBeep(freq = 600, duration = 0.05, type = 'sine') {
      if (!this.enabled) return;
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    }

    playAlertKlaxon() {
      if (!this.enabled) return;
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.15);
      osc.frequency.linearRampToValueAtTime(440, now + 0.3);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.15);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    }

    playResolutionArpeggio() {
      if (!this.enabled) return;
      this.init();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playBeep(freq, 0.14, 'sine');
        }, idx * 70);
      });
    }
  }

  /* ==========================================================================
     2. TELEMETRY SIMULATION ENGINE & CHAOS STATES
     ========================================================================== */
  class TelemetryEngine {
    constructor() {
      // Nominal Baseline State
      this.state = {
        rps: 24850,
        latencyP50: 14.2,
        latencyP95: 28.6,
        latencyP99: 42.8,
        errorRate: 0.012,
        healthScore: 99.8,
        activePods: 48,
        totalPods: 48,
        cpuPercent: 42,
        memPercent: 61,
        iops: 8200
      };

      // Chaos Injection State
      this.activeScenario = 'nominal';
      this.incidentStartTime = null;
      this.incidentDurationSec = 0;
      this.autoRemediationEnabled = true;

      // History Buffers for Charts
      this.historyCapacity = 60;
      this.rpsHistory = new Array(30).fill(24800);
      this.p99History = new Array(30).fill(42.8);
      this.errHistory = new Array(30).fill(0.012);

      // Multi-Curve Latency History (60 time ticks)
      this.streamHistory = {
        p50: new Array(this.historyCapacity).fill(14),
        p95: new Array(this.historyCapacity).fill(28),
        p99: new Array(this.historyCapacity).fill(42)
      };

      // 60-Bucket Regional Heatmap (5 regions x 60 columns)
      this.regions = ['us-east-1', 'us-west-2', 'eu-central-1', 'ap-south-1', 'sa-east-1'];
      this.heatmapData = {};
      this.regions.forEach(r => {
        this.heatmapData[r] = new Array(60).fill(18 + Math.random() * 8);
      });

      // Microservice Nodes
      this.services = [
        { id: 'gateway', name: 'API Gateway (Kong)', role: 'Ingress Controller', rps: 24850, latency: 12.4, errors: 0.0, status: 'HEALTHY', replicas: '12/12', mem: '512 MB', icon: '🌐', x: 80, y: 190 },
        { id: 'auth', name: 'Auth IAM Service', role: 'OAuth2 / JWT Token', rps: 8400, latency: 4.2, errors: 0.0, status: 'HEALTHY', replicas: '8/8', mem: '256 MB', icon: '🔑', x: 260, y: 90 },
        { id: 'checkout', name: 'Checkout Core API', role: 'Business Order Engine', rps: 12100, latency: 24.5, errors: 0.01, status: 'HEALTHY', replicas: '16/16', mem: '1024 MB', icon: '🛒', x: 260, y: 290 },
        { id: 'payment', name: 'Payment Gateway Svc', role: 'Stripe & Ledger Tx', rps: 4200, latency: 68.0, errors: 0.0, status: 'HEALTHY', replicas: '6/6', mem: '768 MB', icon: '💳', x: 440, y: 90 },
        { id: 'search', name: 'Vector Search Engine', role: 'Qdrant & Embeddings', rps: 9800, latency: 32.1, errors: 0.0, status: 'HEALTHY', replicas: '10/10', mem: '1536 MB', icon: '🔎', x: 440, y: 290 },
        { id: 'redis', name: 'Distributed Redis 7', role: 'Shared Cache Cluster', rps: 45000, latency: 1.1, errors: 0.0, status: 'HEALTHY', replicas: '6/6 Nodes', mem: '4.2 GB', icon: '⚡', x: 620, y: 60 },
        { id: 'postgres', name: 'Primary Aurora DB', role: 'PostgreSQL 16 Multi-AZ', rps: 18200, latency: 8.4, errors: 0.0, status: 'HEALTHY', replicas: 'Primary + 3 Ro', mem: '16 GB', icon: '🗄️', x: 620, y: 190 },
        { id: 'kafka', name: 'Kafka Event Bus', role: 'Telemetry & Ingestion', rps: 76000, latency: 2.8, errors: 0.0, status: 'HEALTHY', replicas: '5 Brokers', mem: '8 GB', icon: '📡', x: 620, y: 320 }
      ];

      // Edges (connections)
      this.edges = [
        { from: 'gateway', to: 'auth' },
        { from: 'gateway', to: 'checkout' },
        { from: 'auth', to: 'redis' },
        { from: 'checkout', to: 'payment' },
        { from: 'checkout', to: 'search' },
        { from: 'checkout', to: 'postgres' },
        { from: 'payment', to: 'postgres' },
        { from: 'payment', to: 'kafka' },
        { from: 'search', to: 'redis' }
      ];

      this.tickCount = 0;
    }

    injectScenario(scenarioKey) {
      this.activeScenario = scenarioKey;
      if (scenarioKey === 'nominal') {
        this.incidentStartTime = null;
        this.incidentDurationSec = 0;
        this.resetToNominal();
      } else {
        this.incidentStartTime = Date.now();
        this.applyScenarioDisturbance(scenarioKey);
      }
    }

    resetToNominal() {
      this.services.forEach(s => {
        s.status = 'HEALTHY';
      });
      this.state.activePods = 48;
      this.state.healthScore = 99.8;
      this.state.errorRate = 0.012;
      this.state.latencyP99 = 42.8;
    }

    applyScenarioDisturbance(key) {
      if (key === 'pg_exhaustion') {
        const pg = this.services.find(s => s.id === 'postgres');
        const chk = this.services.find(s => s.id === 'checkout');
        if (pg) { pg.status = 'CRITICAL'; pg.latency = 1840; pg.errors = 14.8; }
        if (chk) { chk.status = 'DEGRADED'; chk.latency = 920; chk.errors = 8.4; }
      } else if (key === 'transit_degraded') {
        const gw = this.services.find(s => s.id === 'gateway');
        if (gw) { gw.status = 'DEGRADED'; gw.latency = 420; }
      } else if (key === 'mem_leak') {
        const srch = this.services.find(s => s.id === 'search');
        if (srch) { srch.status = 'CRITICAL'; srch.mem = '98% OOM'; srch.latency = 840; }
      } else if (key === 'ddos_flood') {
        const gw = this.services.find(s => s.id === 'gateway');
        const chk = this.services.find(s => s.id === 'checkout');
        if (gw) { gw.status = 'CRITICAL'; gw.rps = 52000; gw.errors = 28.5; }
        if (chk) { chk.status = 'DEGRADED'; chk.errors = 19.2; }
      }
    }

    tick() {
      this.tickCount++;
      const isIncident = this.activeScenario !== 'nominal';

      if (isIncident && this.incidentStartTime) {
        this.incidentDurationSec = Math.floor((Date.now() - this.incidentStartTime) / 1000);
      }

      // Compute Dynamic Telemetry Values
      const jitter = (Math.random() - 0.48) * 1.5;

      if (!isIncident) {
        // Nominal Sine Curve Drift
        const wave = Math.sin(this.tickCount * 0.1) * 600;
        this.state.rps = Math.round(24800 + wave + (Math.random() * 400 - 200));
        this.state.latencyP50 = +(14.2 + (Math.random() * 1.2 - 0.6)).toFixed(1);
        this.state.latencyP95 = +(28.6 + (Math.random() * 2.0 - 1.0)).toFixed(1);
        this.state.latencyP99 = +(42.8 + jitter).toFixed(1);
        this.state.errorRate = +(0.012 + (Math.random() * 0.004 - 0.002)).toFixed(3);
        this.state.healthScore = 99.8;
      } else {
        // Incident State Disturbance
        if (this.activeScenario === 'pg_exhaustion') {
          this.state.latencyP99 = +(1600 + Math.random() * 400).toFixed(1);
          this.state.latencyP95 = +(850 + Math.random() * 150).toFixed(1);
          this.state.latencyP50 = +(180 + Math.random() * 40).toFixed(1);
          this.state.errorRate = +(12.4 + Math.random() * 3.2).toFixed(2);
          this.state.healthScore = +(68.4 + Math.random() * 4).toFixed(1);
          this.state.rps = Math.round(18200 + Math.random() * 800);
        } else if (this.activeScenario === 'transit_degraded') {
          this.state.latencyP99 = +(820 + Math.random() * 180).toFixed(1);
          this.state.latencyP95 = +(460 + Math.random() * 90).toFixed(1);
          this.state.latencyP50 = +(65 + Math.random() * 15).toFixed(1);
          this.state.errorRate = +(3.8 + Math.random() * 1.2).toFixed(2);
          this.state.healthScore = 84.2;
        } else if (this.activeScenario === 'mem_leak') {
          this.state.latencyP99 = +(950 + Math.random() * 240).toFixed(1);
          this.state.latencyP95 = +(380 + Math.random() * 70).toFixed(1);
          this.state.errorRate = +(5.2 + Math.random() * 1.8).toFixed(2);
          this.state.healthScore = 79.5;
        } else if (this.activeScenario === 'ddos_flood') {
          this.state.rps = Math.round(48000 + Math.random() * 4000);
          this.state.latencyP99 = +(640 + Math.random() * 140).toFixed(1);
          this.state.errorRate = +(24.8 + Math.random() * 4.2).toFixed(2);
          this.state.healthScore = 61.2;
        }
      }

      // Update Sparkline Buffers
      this.rpsHistory.shift();
      this.rpsHistory.push(this.state.rps);

      this.p99History.shift();
      this.p99History.push(this.state.latencyP99);

      this.errHistory.shift();
      this.errHistory.push(this.state.errorRate);

      // Update Stream History (60 items)
      this.streamHistory.p50.shift();
      this.streamHistory.p50.push(this.state.latencyP50);

      this.streamHistory.p95.shift();
      this.streamHistory.p95.push(this.state.latencyP95);

      this.streamHistory.p99.shift();
      this.streamHistory.p99.push(this.state.latencyP99);

      // Update Heatmap Columns (1 column per tick)
      this.regions.forEach(reg => {
        let val = 18 + Math.random() * 10;
        if (isIncident) {
          if (this.activeScenario === 'transit_degraded' && reg === 'us-east-1') {
            val = 280 + Math.random() * 80;
          } else if (this.activeScenario === 'pg_exhaustion') {
            val = 140 + Math.random() * 180;
          } else if (this.activeScenario === 'ddos_flood') {
            val = 90 + Math.random() * 120;
          }
        }
        this.heatmapData[reg].shift();
        this.heatmapData[reg].push(val);
      });
    }
  }

  /* ==========================================================================
     3. SERVICE MESH TOPOLOGY RENDERER
     ========================================================================== */
  class TopologyRenderer {
    constructor(canvas, engine, onSelectNode) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.engine = engine;
      this.onSelectNode = onSelectNode;
      this.particles = [];
      this.selectedNodeId = null;

      // Particle simulation for active data wires
      for (let i = 0; i < 28; i++) {
        const edge = this.engine.edges[Math.floor(Math.random() * this.engine.edges.length)];
        this.particles.push({
          edge: edge,
          progress: Math.random(),
          speed: 0.008 + Math.random() * 0.012
        });
      }

      this.setupInteraction();
    }

    resize() {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.ctx.scale(dpr, dpr);
      this.width = rect.width;
      this.height = rect.height;
    }

    setupInteraction() {
      this.canvas.addEventListener('click', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Scale coords to logical canvas
        const scaleX = this.width / 740;
        const scaleY = this.height / 380;

        let found = null;
        this.engine.services.forEach(node => {
          const nx = node.x * scaleX;
          const ny = node.y * scaleY;
          const dist = Math.hypot(clickX - nx, clickY - ny);
          if (dist < 26) {
            found = node;
          }
        });

        if (found) {
          this.selectedNodeId = found.id;
          if (this.onSelectNode) this.onSelectNode(found);
        }
      });
    }

    render() {
      if (!this.width || !this.height) this.resize();
      const ctx = this.ctx;
      const scaleX = this.width / 740;
      const scaleY = this.height / 380;

      ctx.clearRect(0, 0, this.width, this.height);

      // Draw Grid Lines (Subtle Matrix)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < this.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this.height);
        ctx.stroke();
      }
      for (let y = 0; y < this.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(this.width, y);
        ctx.stroke();
      }

      // Draw Edges (Connecting Lines)
      this.engine.edges.forEach(edge => {
        const src = this.engine.services.find(s => s.id === edge.from);
        const dst = this.engine.services.find(s => s.id === edge.to);
        if (!src || !dst) return;

        const x1 = src.x * scaleX;
        const y1 = src.y * scaleY;
        const x2 = dst.x * scaleX;
        const y2 = dst.y * scaleY;

        ctx.strokeStyle = (src.status === 'CRITICAL' || dst.status === 'CRITICAL')
          ? 'rgba(239, 68, 68, 0.4)'
          : 'rgba(6, 182, 212, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo((x1 + x2) / 2, y1, (x1 + x2) / 2, y2, x2, y2);
        ctx.stroke();
      });

      // Draw Flowing Data Particles
      this.particles.forEach(p => {
        const src = this.engine.services.find(s => s.id === p.edge.from);
        const dst = this.engine.services.find(s => s.id === p.edge.to);
        if (!src || !dst) return;

        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;

        const x1 = src.x * scaleX;
        const y1 = src.y * scaleY;
        const x2 = dst.x * scaleX;
        const y2 = dst.y * scaleY;

        // Cubic Bezier interpolation
        const cx1 = (x1 + x2) / 2;
        const cy1 = y1;
        const cx2 = (x1 + x2) / 2;
        const cy2 = y2;
        const t = p.progress;

        const px = Math.pow(1 - t, 3) * x1 + 3 * Math.pow(1 - t, 2) * t * cx1 + 3 * (1 - t) * Math.pow(t, 2) * cx2 + Math.pow(t, 3) * x2;
        const py = Math.pow(1 - t, 3) * y1 + 3 * Math.pow(1 - t, 2) * t * cy1 + 3 * (1 - t) * Math.pow(t, 2) * cy2 + Math.pow(t, 3) * y2;

        ctx.fillStyle = (src.status === 'CRITICAL' || dst.status === 'CRITICAL') ? '#ef4444' : '#06b6d4';
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Nodes
      this.engine.services.forEach(node => {
        const nx = node.x * scaleX;
        const ny = node.y * scaleY;

        let haloColor = 'rgba(16, 185, 129, 0.4)';
        let strokeColor = '#10b981';
        if (node.status === 'CRITICAL') {
          haloColor = 'rgba(239, 68, 68, 0.6)';
          strokeColor = '#ef4444';
        } else if (node.status === 'DEGRADED') {
          haloColor = 'rgba(245, 158, 11, 0.5)';
          strokeColor = '#f59e0b';
        } else if (node.id === 'gateway') {
          strokeColor = '#06b6d4';
          haloColor = 'rgba(6, 182, 212, 0.4)';
        }

        // Selected halo
        if (this.selectedNodeId === node.id) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(nx, ny, 26, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Pulse Halo
        ctx.fillStyle = haloColor;
        ctx.beginPath();
        ctx.arc(nx, ny, 20 + Math.sin(this.engine.tickCount * 0.15) * 2, 0, Math.PI * 2);
        ctx.fill();

        // Node Body
        ctx.fillStyle = '#0b1325';
        ctx.beginPath();
        ctx.arc(nx, ny, 16, 0, Math.PI * 2);
        ctx.fill();

        // Node Border
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(nx, ny, 16, 0, Math.PI * 2);
        ctx.stroke();

        // Node Icon/Glyph
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(node.icon, nx, ny);

        // Node Label
        ctx.font = '600 11px Outfit, sans-serif';
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText(node.name, nx, ny + 28);

        // Role & Subtitle
        ctx.font = '400 9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`${node.latency}ms • ${node.status}`, nx, ny + 40);
      });
    }
  }

  /* ==========================================================================
     4. TELEMETRY CHARTS & HEATMAP RENDERERS
     ========================================================================== */
  class CanvasCharts {
    static drawSparkline(canvas, data, strokeColor, fillColor) {
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      if (!data || data.length < 2) return;

      const min = Math.min(...data);
      const max = Math.max(...data);
      const range = max - min || 1;

      ctx.beginPath();
      data.forEach((val, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((val - min) / range) * (h - 6) - 3;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Area fill
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();
    }

    static drawLatencyCurves(canvas, streamHistory) {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const steps = 4;
      for (let i = 0; i <= steps; i++) {
        const y = (h / steps) * i;
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Max scale clamp (at least 200ms)
      const allVals = [...streamHistory.p50, ...streamHistory.p95, ...streamHistory.p99];
      const maxVal = Math.max(200, ...allVals) * 1.15;

      // Draw SLO Threshold Line (120ms)
      const slaY = h - (120 / maxVal) * (h - 20) - 10;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(40, slaY);
      ctx.lineTo(w, slaY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ef4444';
      ctx.fillText('SLO 120ms', 42, slaY - 4);

      // Helper to render curve
      const renderCurve = (series, strokeColor, fillColor) => {
        ctx.beginPath();
        series.forEach((val, idx) => {
          const x = 40 + (idx / (series.length - 1)) * (w - 40);
          const y = h - (val / maxVal) * (h - 20) - 10;
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        if (fillColor) {
          ctx.lineTo(w, h);
          ctx.lineTo(40, h);
          ctx.closePath();
          ctx.fillStyle = fillColor;
          ctx.fill();
        }
      };

      renderCurve(streamHistory.p99, '#ef4444', 'rgba(239, 68, 68, 0.08)');
      renderCurve(streamHistory.p95, '#f59e0b', 'rgba(245, 158, 11, 0.06)');
      renderCurve(streamHistory.p50, '#06b6d4', 'rgba(6, 182, 212, 0.1)');

      // Y-Axis Labels
      ctx.fillStyle = '#64748b';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${Math.round(maxVal)}ms`, 36, 12);
      ctx.fillText(`${Math.round(maxVal / 2)}ms`, 36, h / 2);
      ctx.fillText('0ms', 36, h - 10);
    }

    static drawRegionalHeatmap(canvas, heatmapData, regions) {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      const labelW = 90;
      const cols = 60;
      const cellW = (w - labelW - 10) / cols;
      const rows = regions.length;
      const cellH = (h - 20) / rows;

      // Color mapper
      const getColor = (ms) => {
        if (ms < 30) return '#06b6d4'; // Cyan
        if (ms < 75) return '#10b981'; // Emerald
        if (ms < 180) return '#f59e0b'; // Amber
        return '#ef4444'; // Red
      };

      regions.forEach((reg, rIdx) => {
        const y = 10 + rIdx * cellH;

        // Label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(reg, 6, y + cellH * 0.65);

        // Cells
        const series = heatmapData[reg] || [];
        series.forEach((val, cIdx) => {
          const x = labelW + cIdx * cellW;
          ctx.fillStyle = getColor(val);
          ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 3);
        });
      });
    }

    static drawThroughputBreakdown(canvas, rps, errRate) {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Stacked Bar Visualizer
      const errCount = Math.round(rps * (errRate / 100));
      const clientErr = Math.round(rps * 0.015);
      const successCount = Math.max(0, rps - errCount - clientErr);

      const barH = 34;
      const barY = h / 2 - barH / 2;
      const fullW = w - 40;

      const successW = (successCount / rps) * fullW;
      const clientErrW = (clientErr / rps) * fullW;
      const errW = (errCount / rps) * fullW;

      // Success 2xx
      ctx.fillStyle = '#10b981';
      ctx.fillRect(20, barY, successW, barH);

      // 4xx Client
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(20 + successW, barY, clientErrW, barH);

      // 5xx Server
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(20 + successW + clientErrW, barY, errW, barH);

      // Value annotations
      ctx.font = '600 11px Outfit, sans-serif';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      if (successW > 80) ctx.fillText(`2xx: ${successCount.toLocaleString()}`, 20 + successW / 2, barY + 22);
      if (errW > 40) ctx.fillText(`5xx: ${errCount}`, 20 + successW + clientErrW + errW / 2, barY + 22);
    }
  }

  /* ==========================================================================
     5. AUTOMATED RUNBOOK ORCHESTRATOR
     ========================================================================== */
  class RunbookOrchestrator {
    constructor(engine, audio, onLog) {
      this.engine = engine;
      this.audio = audio;
      this.onLog = onLog;
      this.isRunning = false;
      this.currentStep = 1;
      this.totalSteps = 4;
      this.timerId = null;
    }

    startRemediation() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.currentStep = 1;
      this.updateUI();

      this.log('[INIT] Triggering Autonomous Runbook Protocol RB-AURORA-POOL-DRAIN...');
      this.audio.playClick();

      this.executeStep(1);
    }

    executeStep(stepNum) {
      this.currentStep = stepNum;
      this.updateUI();

      if (stepNum === 1) {
        this.log('[STEP 1/4] Anomaly Confirmation: Verifying Prometheus Alert Thresholds...');
        setTimeout(() => {
          this.log('[METRIC] Postgres active_connections=498/500 (99.6% saturation confirmed).');
          this.audio.playBeep(700, 0.05);
          this.advanceNext(2);
        }, 1200);
      } else if (stepNum === 2) {
        this.log('[STEP 2/4] Isolating Blast Radius: Enabling Envoy Circuit Breaker on /checkout...');
        setTimeout(() => {
          this.log('[ISOLATE] Route /checkout circuit-breaker TRIPPED. Shedding 30% synthetic load.');
          this.audio.playBeep(850, 0.05);
          this.advanceNext(3);
        }, 1500);
      } else if (stepNum === 3) {
        this.log('[STEP 3/4] Mitigating: Draining Aurora Connection Pool & Promoting Read Replica...');
        setTimeout(() => {
          this.log('[EXEC] psql: SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state="idle";');
          this.log('[SCALE] PgBouncer pooler enlarged: max_client_conn=2000, default_pool_size=40.');
          this.audio.playBeep(1000, 0.06);
          this.advanceNext(4);
        }, 1800);
      } else if (stepNum === 4) {
        this.log('[STEP 4/4] SLO Verification: Probing p99 latency & transaction success rate...');
        setTimeout(() => {
          this.log('[VERIFY] P99 Latency returned to 42.1ms (SLO Passed).');
          this.log('[SUCCESS] Autonomous Incident Remediation Complete. System nominal.');
          this.isRunning = false;
          this.engine.resetToNominal();
          this.engine.activeScenario = 'nominal';
          this.audio.playResolutionArpeggio();
          this.updateUI();
          if (window.onIncidentResolved) window.onIncidentResolved();
        }, 1400);
      }
    }

    advanceNext(nextStep) {
      this.currentStep = nextStep;
      this.updateUI();
      if (this.isRunning && nextStep <= 4) {
        this.executeStep(nextStep);
      }
    }

    abort() {
      this.isRunning = false;
      this.log('[ABORT] Runbook execution halted manually by SRE operator.');
      this.updateUI();
    }

    log(msg) {
      if (this.onLog) this.onLog(msg);
    }

    updateUI() {
      for (let i = 1; i <= 4; i++) {
        const stepEl = document.getElementById(`step-node-${i}`);
        const lineEl = document.getElementById(`step-line-${i}`);
        if (!stepEl) continue;

        if (i < this.currentStep) {
          stepEl.className = 'stepper-step completed';
          if (lineEl) lineEl.className = 'stepper-line completed';
        } else if (i === this.currentStep) {
          stepEl.className = 'stepper-step active';
          if (lineEl) lineEl.className = 'stepper-line';
        } else {
          stepEl.className = 'stepper-step';
          if (lineEl) lineEl.className = 'stepper-line';
        }
      }

      const statusEl = document.getElementById('runbook-engine-status');
      if (statusEl) {
        if (this.isRunning) {
          statusEl.innerHTML = '<span class="engine-dot executing"></span> EXECUTING';
        } else {
          statusEl.innerHTML = '<span class="engine-dot ready"></span> STANDBY';
        }
      }
    }
  }

  /* ==========================================================================
     6. DISTRIBUTED TRACE WATERFALL
     ========================================================================== */
  class TraceWaterfall {
    constructor() {
      this.traces = {
        checkout_success: {
          id: 'tr-8f49b21e0a84',
          operation: 'GET /v2/orders/checkout',
          status: 200,
          totalDuration: 42.4,
          spans: [
            { id: 'sp-1', svc: 'api-gateway', op: 'ingress.http_request', start: 0, duration: 42.4, status: 200, tags: { route: '/v2/orders/checkout', client_ip: '203.0.113.42' } },
            { id: 'sp-2', svc: 'auth-iam', op: 'jwt.authenticate_token', start: 2.1, duration: 4.2, status: 200, tags: { scope: 'orders:read', key_id: 'kms-0921' } },
            { id: 'sp-3', svc: 'checkout-api', op: 'cart.validate_inventory', start: 7.4, duration: 16.8, status: 200, tags: { items_count: 3, cart_id: 'c-8821' } },
            { id: 'sp-4', svc: 'redis-cache', op: 'mget.product_pricing', start: 9.0, duration: 1.4, status: 200, tags: { hit: true, keys: 3 } },
            { id: 'sp-5', svc: 'postgres-db', op: 'select.customer_profile', start: 25.2, duration: 11.2, status: 200, tags: { rows: 1, table: 'customers' } },
            { id: 'sp-6', svc: 'kafka-bus', op: 'emit.checkout_viewed', start: 38.0, duration: 3.1, status: 200, tags: { partition: 2, offset: 49821 } }
          ]
        },
        pg_timeout: {
          id: 'tr-7a31c899d4f1',
          operation: 'POST /v2/orders/payment',
          status: 504,
          totalDuration: 1820.0,
          spans: [
            { id: 'sp-1', svc: 'api-gateway', op: 'ingress.http_request', start: 0, duration: 1820.0, status: 504, tags: { error: 'Gateway Timeout' } },
            { id: 'sp-2', svc: 'checkout-api', op: 'order.process_charge', start: 5.0, duration: 1810.0, status: 504, tags: { reason: 'db_pool_timeout' } },
            { id: 'sp-3', svc: 'postgres-db', op: 'tx.begin.lock_for_update', start: 12.0, duration: 1800.0, status: 504, tags: { lock_wait_timeout: '1800ms', query: 'SELECT * FROM inventory FOR UPDATE' } }
          ]
        },
        auth_ratelimit: {
          id: 'tr-3e11f008aa22',
          operation: 'POST /v1/auth/token',
          status: 429,
          totalDuration: 9.2,
          spans: [
            { id: 'sp-1', svc: 'api-gateway', op: 'ingress.http_request', start: 0, duration: 9.2, status: 429, tags: { ip_throttled: '198.51.100.22', limit: '100 req/s' } },
            { id: 'sp-2', svc: 'redis-cache', op: 'token_bucket.check', start: 1.2, duration: 1.8, status: 429, tags: { current_bucket: 0, retry_after: 5 } }
          ]
        }
      };
    }

    render(container, traceKey, onSelectSpan) {
      const trace = this.traces[traceKey] || this.traces.checkout_success;
      container.innerHTML = '';

      const traceIdBadge = document.getElementById('current-trace-id');
      if (traceIdBadge) {
        traceIdBadge.textContent = `Trace: ${trace.id} (${trace.status} • ${trace.totalDuration}ms)`;
      }

      trace.spans.forEach(span => {
        const row = document.createElement('div');
        row.className = 'span-row';

        const offsetPct = (span.start / trace.totalDuration) * 100;
        const widthPct = Math.max(3, (span.duration / trace.totalDuration) * 100);

        row.innerHTML = `
          <div class="span-svc-label">
            <span class="legend-dot ${span.status >= 500 ? 'dot-crimson' : span.status >= 400 ? 'dot-amber' : 'dot-cyan'}"></span>
            <span>${span.svc}</span>
          </div>
          <div class="span-track-wrap">
            <div class="span-bar ${span.status >= 500 ? 'span-err' : ''}" style="left: ${offsetPct}%; width: ${widthPct}%;"></div>
          </div>
          <div class="span-dur-val">${span.duration}ms</div>
        `;

        row.addEventListener('click', () => {
          if (onSelectSpan) onSelectSpan(span);
        });

        container.appendChild(row);
      });
    }
  }

  /* ==========================================================================
     7. STRUCTURED LOG STREAM GENERATOR
     ========================================================================== */
  class LogStreamer {
    constructor(container, maxLogs = 120) {
      this.container = container;
      this.maxLogs = maxLogs;
      this.logs = [];
      this.paused = false;
      this.activeLevel = 'ALL';
      this.searchQuery = '';

      this.samplePool = [
        { svc: 'api-gateway', lvl: 'INFO', msg: 'Handled incoming HTTP request 200 OK GET /v2/orders/checkout' },
        { svc: 'auth-iam', lvl: 'INFO', msg: 'Verified JWT RS256 token signature in 1.4ms (sub: usr_8921)' },
        { svc: 'checkout-api', lvl: 'INFO', msg: 'Cart items synchronized successfully with product catalog' },
        { svc: 'redis-cache', lvl: 'INFO', msg: 'Key hit product_meta:9812 TTL=360s latency=0.8ms' },
        { svc: 'postgres-db', lvl: 'INFO', msg: 'Query executed SELECT * FROM customers WHERE id = $1 (duration: 3.2ms)' },
        { svc: 'kafka-bus', lvl: 'INFO', msg: 'Telemetry packet emitted to topic telemetry.stream partition=3' },
        { svc: 'checkout-api', lvl: 'WARN', msg: 'Slow query warning: inventory lock wait 84ms > 50ms threshold' },
        { svc: 'postgres-db', lvl: 'ERROR', msg: 'Connection pool exhausted: 498/500 active threads timeout' },
        { svc: 'payment-svc', lvl: 'FATAL', msg: 'Circuit breaker tripped: Stripe payment endpoint returned 503' }
      ];
    }

    emitRandomLog(isIncident, scenario) {
      if (this.paused) return;

      let item = this.samplePool[Math.floor(Math.random() * (this.samplePool.length - 3))];

      if (isIncident) {
        if (scenario === 'pg_exhaustion') {
          item = { svc: 'postgres-db', lvl: 'ERROR', msg: 'FATAL: remaining connection slots are reserved for non-replication superuser' };
        } else if (scenario === 'transit_degraded') {
          item = { svc: 'api-gateway', lvl: 'WARN', msg: 'Transit gateway us-east-1 packet retransmit rate exceeded 12%' };
        } else if (scenario === 'mem_leak') {
          item = { svc: 'search-engine', lvl: 'ERROR', msg: 'JVM Heap Memory Exceeded 98% threshold (GC pause 740ms)' };
        } else if (scenario === 'ddos_flood') {
          item = { svc: 'api-gateway', lvl: 'WARN', msg: 'Token bucket rate-limit exceeded (HTTP 429) from remote ASN 13335' };
        }
      }

      const logObj = {
        timestamp: new Date().toISOString().split('T')[1].replace('Z', ''),
        level: item.lvl,
        service: item.svc,
        traceId: 'tr-' + Math.random().toString(16).substr(2, 8),
        message: item.msg
      };

      this.logs.unshift(logObj);
      if (this.logs.length > this.maxLogs) this.logs.pop();
      this.render();
    }

    render() {
      const filtered = this.logs.filter(l => {
        if (this.activeLevel !== 'ALL' && l.level !== this.activeLevel) return false;
        if (this.searchQuery) {
          const q = this.searchQuery.toLowerCase();
          return l.message.toLowerCase().includes(q) || l.service.toLowerCase().includes(q) || l.traceId.toLowerCase().includes(q);
        }
        return true;
      });

      this.container.innerHTML = filtered.slice(0, 40).map(l => `
        <div class="log-entry-row">
          <span class="log-time">${l.timestamp}</span>
          <span class="log-level-badge lvl-${l.level}">${l.level}</span>
          <span class="log-svc">${l.service}</span>
          <span class="log-trace">${l.traceId}</span>
          <span class="log-msg" title="${l.message}">${l.message}</span>
        </div>
      `).join('');
    }
  }

  /* ==========================================================================
     8. MISSION CONTROL APP CONTROLLER
     ========================================================================== */
  class PulseMetricsApp {
    constructor() {
      this.audio = new AudioSynth();
      this.engine = new TelemetryEngine();
      this.traceWaterfall = new TraceWaterfall();

      // DOM Elements
      this.dom = {
        utcClock: document.getElementById('live-utc-clock'),
        pulseBadge: document.getElementById('system-pulse-badge'),
        pulseText: document.getElementById('system-status-text'),
        scenarioSelect: document.getElementById('scenario-select'),
        btnTriggerChaos: document.getElementById('btn-trigger-chaos'),
        toggleAutoRemediation: document.getElementById('toggle-auto-remediation'),
        btnToggleSound: document.getElementById('btn-toggle-sound'),
        soundIndicator: document.getElementById('sound-indicator'),
        btnEmergency: document.getElementById('btn-emergency-action'),
        incidentBanner: document.getElementById('incident-banner'),
        bannerSevBadge: document.getElementById('banner-sev-badge'),
        bannerIncidentTitle: document.getElementById('banner-incident-title'),
        incidentTimer: document.getElementById('incident-timer'),
        btnBannerRunbook: document.getElementById('btn-banner-runbook'),
        btnBannerDismiss: document.getElementById('btn-banner-dismiss'),

        // KPIs
        valRps: document.getElementById('kpi-val-rps'),
        deltaRps: document.getElementById('kpi-rps-delta'),
        valP99: document.getElementById('kpi-val-p99'),
        badgeP99: document.getElementById('kpi-p99-badge'),
        valErr: document.getElementById('kpi-val-err'),
        badgeErr: document.getElementById('kpi-err-badge'),
        valHealth: document.getElementById('kpi-val-health'),
        healthGaugeFill: document.getElementById('health-gauge-fill'),

        // Canvases
        sparklineRps: document.getElementById('sparkline-rps'),
        sparklineP99: document.getElementById('sparkline-p99'),
        sparklineErr: document.getElementById('sparkline-err'),
        topologyCanvas: document.getElementById('topology-canvas'),
        latencyStreamCanvas: document.getElementById('latency-stream-canvas'),
        heatmapCanvas: document.getElementById('heatmap-canvas'),
        throughputCanvas: document.getElementById('throughput-canvas'),

        // Flyout Inspector
        nodeInspector: document.getElementById('node-inspector'),
        btnCloseInspector: document.getElementById('btn-close-inspector'),
        inspectorName: document.getElementById('inspector-name'),
        inspectorRole: document.getElementById('inspector-role'),
        inspectorStatus: document.getElementById('inspector-status'),
        inspectorRps: document.getElementById('inspector-rps'),
        inspectorLatency: document.getElementById('inspector-latency'),
        inspectorErrors: document.getElementById('inspector-errors'),
        inspectorMemory: document.getElementById('inspector-memory'),
        inspectorReplicas: document.getElementById('inspector-replicas'),

        // Runbook Terminal
        terminalScreen: document.getElementById('terminal-log-flow'),
        btnClearTerm: document.getElementById('btn-clear-term'),
        btnRunRemediation: document.getElementById('btn-run-remediation'),
        btnStepRunbook: document.getElementById('btn-step-runbook'),
        btnAbortRunbook: document.getElementById('btn-abort-runbook'),

        // Trace Waterfall
        traceSpansList: document.getElementById('trace-spans-list'),
        traceSampleSelect: document.getElementById('trace-sample-select'),
        btnRefreshTrace: document.getElementById('btn-refresh-trace'),
        spanModal: document.getElementById('span-inspector-modal'),
        spanModalTitle: document.getElementById('span-modal-title'),
        spanModalDetails: document.getElementById('span-modal-details'),
        btnCloseSpanInspect: document.getElementById('btn-close-span-inspect'),

        // Logs
        logsStreamBody: document.getElementById('logs-stream-body'),
        logSearchInput: document.getElementById('log-search-input'),
        btnToggleLogPause: document.getElementById('btn-toggle-log-pause'),
        btnClearLogs: document.getElementById('btn-clear-logs'),

        // Post-Mortem & Snapshots
        btnOpenPostmortem: document.getElementById('btn-open-postmortem'),
        postmortemModal: document.getElementById('postmortem-modal'),
        btnClosePostmortem: document.getElementById('btn-close-postmortem'),
        postmortemContent: document.getElementById('postmortem-markdown-content'),
        btnCopyPostmortem: document.getElementById('btn-copy-postmortem'),
        btnDownloadPostmortem: document.getElementById('btn-download-postmortem'),
        btnExportSnapshot: document.getElementById('btn-export-snapshot'),
        toastContainer: document.getElementById('toast-container')
      };

      // Sub-modules
      this.topologyRenderer = new TopologyRenderer(this.dom.topologyCanvas, this.engine, (node) => {
        this.openNodeInspector(node);
      });

      this.runbook = new RunbookOrchestrator(this.engine, this.audio, (msg) => {
        this.appendTerminalLog(msg);
      });

      this.logStreamer = new LogStreamer(this.dom.logsStreamBody);

      window.onIncidentResolved = () => {
        this.dom.incidentBanner.classList.add('hidden');
        this.dom.scenarioSelect.value = 'nominal';
        this.showToast('Incident resolved successfully! Telemetry returning to nominal.');
      };

      this.initEvents();
      this.initTabs();
      this.traceWaterfall.render(this.dom.traceSpansList, 'checkout_success', (span) => {
        this.openSpanInspector(span);
      });

      // Start Telemetry Render Loop (1-second tick)
      setInterval(() => this.tickLoop(), 1000);

      // Fast Animation Loop for Topology particles (60fps)
      const animLoop = () => {
        this.topologyRenderer.render();
        requestAnimationFrame(animLoop);
      };
      animLoop();

      // Pre-populate terminal
      this.appendTerminalLog('[SYSTEM] Cluster telemetry telemetry daemon active. Target SLO: 99.99%.');
    }

    initEvents() {
      // Clock
      setInterval(() => {
        const d = new Date();
        this.dom.utcClock.textContent = d.toUTCString().split(' ')[4] + ' UTC';
      }, 1000);

      // Audio Toggle
      this.dom.btnToggleSound.addEventListener('click', () => {
        const isSound = this.audio.toggle();
        this.dom.soundIndicator.textContent = isSound ? '🔊' : '🔇';
        this.showToast(`Sound Synthesizer: ${isSound ? 'ENABLED' : 'MUTED'}`);
      });

      // Chaos Injection
      this.dom.btnTriggerChaos.addEventListener('click', () => {
        const sc = this.dom.scenarioSelect.value;
        this.triggerChaosScenario(sc);
      });

      // War Room Banner Dismiss / Runbook Trigger
      this.dom.btnBannerDismiss.addEventListener('click', () => {
        this.engine.resetToNominal();
        this.engine.activeScenario = 'nominal';
        this.dom.incidentBanner.classList.add('hidden');
        this.dom.scenarioSelect.value = 'nominal';
        this.audio.playResolutionArpeggio();
        this.showToast('Emergency resolve forced. Status: Nominal.');
      });

      this.dom.btnBannerRunbook.addEventListener('click', () => {
        this.runbook.startRemediation();
      });

      this.dom.btnEmergency.addEventListener('click', () => {
        this.triggerChaosScenario('pg_exhaustion');
      });

      // Runbook Buttons
      this.dom.btnRunRemediation.addEventListener('click', () => {
        this.runbook.startRemediation();
      });

      this.dom.btnStepRunbook.addEventListener('click', () => {
        this.runbook.advanceNext(this.runbook.currentStep + 1);
      });

      this.dom.btnAbortRunbook.addEventListener('click', () => {
        this.runbook.abort();
      });

      this.dom.btnClearTerm.addEventListener('click', () => {
        this.dom.terminalScreen.innerHTML = '';
      });

      // Node Inspector Close
      this.dom.btnCloseInspector.addEventListener('click', () => {
        this.dom.nodeInspector.classList.add('hidden');
      });

      // Traces Selector
      this.dom.traceSampleSelect.addEventListener('change', (e) => {
        this.traceWaterfall.render(this.dom.traceSpansList, e.target.value, (span) => {
          this.openSpanInspector(span);
        });
      });

      this.dom.btnRefreshTrace.addEventListener('click', () => {
        this.traceWaterfall.render(this.dom.traceSpansList, this.dom.traceSampleSelect.value, (span) => {
          this.openSpanInspector(span);
        });
        this.audio.playClick();
      });

      this.dom.btnCloseSpanInspect.addEventListener('click', () => {
        this.dom.spanModal.classList.add('hidden');
      });

      // Logs Search & Filters
      this.dom.logSearchInput.addEventListener('input', (e) => {
        this.logStreamer.searchQuery = e.target.value;
        this.logStreamer.render();
      });

      document.querySelectorAll('.lvl-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.lvl-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.logStreamer.activeLevel = btn.dataset.level;
          this.logStreamer.render();
        });
      });

      this.dom.btnToggleLogPause.addEventListener('click', () => {
        this.logStreamer.paused = !this.logStreamer.paused;
        this.dom.btnToggleLogPause.textContent = this.logStreamer.paused ? '▶ Resume' : '⏸ Pause';
      });

      this.dom.btnClearLogs.addEventListener('click', () => {
        this.logStreamer.logs = [];
        this.logStreamer.render();
      });

      // Post-Mortem Modal
      this.dom.btnOpenPostmortem.addEventListener('click', () => {
        this.openPostMortemModal();
      });

      this.dom.btnClosePostmortem.addEventListener('click', () => {
        this.dom.postmortemModal.classList.add('hidden');
      });

      this.dom.btnCopyPostmortem.addEventListener('click', () => {
        const text = this.dom.postmortemContent.textContent;
        navigator.clipboard.writeText(text).then(() => {
          this.showToast('Post-Mortem Markdown copied to clipboard!');
        });
      });

      this.dom.btnDownloadPostmortem.addEventListener('click', () => {
        this.downloadPostMortemFile();
      });

      // Snapshot Export
      this.dom.btnExportSnapshot.addEventListener('click', () => {
        this.captureCanvasSnapshot();
      });

      // Window Resize
      window.addEventListener('resize', () => {
        this.topologyRenderer.resize();
        this.renderCharts();
      });
    }

    initTabs() {
      const tabBtns = document.querySelectorAll('.tab-btn');
      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          tabBtns.forEach(b => b.classList.remove('active'));
          document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

          btn.classList.add('active');
          const target = document.getElementById(btn.dataset.tab);
          if (target) target.classList.add('active');
          this.renderCharts();
          this.audio.playClick();
        });
      });
    }

    triggerChaosScenario(scenarioKey) {
      this.engine.injectScenario(scenarioKey);

      if (scenarioKey === 'nominal') {
        this.dom.incidentBanner.classList.add('hidden');
        this.showToast('Returned to Nominal Traffic Load.');
        this.audio.playBeep(440, 0.08);
      } else {
        this.dom.incidentBanner.classList.remove('hidden');
        const titles = {
          pg_exhaustion: 'Aurora DB Connection Pool Saturation',
          transit_degraded: 'Fiber Cut & Regional Transit Degradation',
          mem_leak: 'Vector Search Engine OOM Spike',
          ddos_flood: 'Layer-7 Ingress DDoS Flood on /checkout'
        };
        this.dom.bannerIncidentTitle.textContent = titles[scenarioKey] || 'Active P1 Incident';
        this.dom.bannerSevBadge.className = scenarioKey === 'transit_degraded' || scenarioKey === 'mem_leak' ? 'sev-tag sev-p2' : 'sev-tag sev-p1';
        this.dom.bannerSevBadge.textContent = scenarioKey === 'transit_degraded' || scenarioKey === 'mem_leak' ? 'P2 MAJOR' : 'P1 CRITICAL';

        this.audio.playAlertKlaxon();
        this.showToast(`CHAOS INJECTED: ${titles[scenarioKey]}`);

        // Auto-heal after 6s if toggle is enabled
        if (this.dom.toggleAutoRemediation.checked) {
          setTimeout(() => {
            if (this.engine.activeScenario !== 'nominal' && !this.runbook.isRunning) {
              this.showToast('AI Auto-Healer detected breach. Launching automated runbook!');
              this.runbook.startRemediation();
            }
          }, 4500);
        }
      }
    }

    tickLoop() {
      this.engine.tick();

      // Update KPI Numbers
      this.dom.valRps.textContent = this.engine.state.rps.toLocaleString();
      this.dom.valP99.textContent = this.engine.state.latencyP99;
      this.dom.valErr.textContent = this.engine.state.errorRate;
      this.dom.valHealth.textContent = this.engine.state.healthScore;
      this.dom.healthGaugeFill.style.width = `${this.engine.state.healthScore}%`;

      // Badge Styling
      if (this.engine.state.latencyP99 > 120) {
        this.dom.badgeP99.className = 'kpi-badge badge-crimson';
        this.dom.badgeP99.textContent = 'BREACH';
      } else if (this.engine.state.latencyP99 > 80) {
        this.dom.badgeP99.className = 'kpi-badge badge-amber';
        this.dom.badgeP99.textContent = 'ELEVATED';
      } else {
        this.dom.badgeP99.className = 'kpi-badge badge-emerald';
        this.dom.badgeP99.textContent = 'PASSING';
      }

      if (this.engine.state.errorRate > 5.0) {
        this.dom.badgeErr.className = 'kpi-badge badge-crimson';
      } else if (this.engine.state.errorRate > 1.0) {
        this.dom.badgeErr.className = 'kpi-badge badge-amber';
      } else {
        this.dom.badgeErr.className = 'kpi-badge badge-emerald';
      }
      this.dom.badgeErr.textContent = `${this.engine.state.errorRate}%`;

      // Status indicator
      if (this.engine.activeScenario !== 'nominal') {
        this.dom.pulseBadge.querySelector('.pulse-dot').className = 'pulse-dot status-critical';
        this.dom.pulseText.textContent = 'INCIDENT ACTIVE';
        const sec = this.engine.incidentDurationSec;
        const mins = String(Math.floor(sec / 60)).padStart(2, '0');
        const secs = String(sec % 60).padStart(2, '0');
        this.dom.incidentTimer.textContent = `00:${mins}:${secs}`;
      } else {
        this.dom.pulseBadge.querySelector('.pulse-dot').className = 'pulse-dot status-healthy';
        this.dom.pulseText.textContent = 'SYSTEM NOMINAL';
      }

      // Draw Mini Sparklines
      CanvasCharts.drawSparkline(this.dom.sparklineRps, this.engine.rpsHistory, '#06b6d4', 'rgba(6, 182, 212, 0.15)');
      CanvasCharts.drawSparkline(this.dom.sparklineP99, this.engine.p99History, '#ef4444', 'rgba(239, 68, 68, 0.15)');
      CanvasCharts.drawSparkline(this.dom.sparklineErr, this.engine.errHistory, '#f59e0b', 'rgba(245, 158, 11, 0.15)');

      // Draw Active Telemetry Tab
      this.renderCharts();

      // Emit log entries
      this.logStreamer.emitRandomLog(this.engine.activeScenario !== 'nominal', this.engine.activeScenario);
    }

    renderCharts() {
      const activeTab = document.querySelector('.tab-btn.active');
      const tabId = activeTab ? activeTab.dataset.tab : 'tab-latency-chart';

      if (tabId === 'tab-latency-chart') {
        CanvasCharts.drawLatencyCurves(this.dom.latencyStreamCanvas, this.engine.streamHistory);
      } else if (tabId === 'tab-regional-heatmap') {
        CanvasCharts.drawRegionalHeatmap(this.dom.heatmapCanvas, this.engine.heatmapData, this.engine.regions);
      } else if (tabId === 'tab-throughput-chart') {
        CanvasCharts.drawThroughputBreakdown(this.dom.throughputCanvas, this.engine.state.rps, this.engine.state.errorRate);
      }
    }

    openNodeInspector(node) {
      this.dom.inspectorName.textContent = node.name;
      this.dom.inspectorRole.textContent = `${node.role} • Node Ref`;
      this.dom.inspectorStatus.textContent = node.status;
      this.dom.inspectorStatus.className = `drawer-val status-val ${node.status === 'CRITICAL' ? 'alert-val' : ''}`;
      this.dom.inspectorRps.textContent = `${node.rps.toLocaleString()} req/s`;
      this.dom.inspectorLatency.textContent = `${node.latency} ms`;
      this.dom.inspectorErrors.textContent = `${node.errors}%`;
      this.dom.inspectorMemory.textContent = node.mem;
      this.dom.inspectorReplicas.textContent = node.replicas;

      this.dom.nodeInspector.classList.remove('hidden');
      this.audio.playClick();
    }

    openSpanInspector(span) {
      this.dom.spanModalTitle.textContent = `Span: ${span.op} (${span.svc})`;
      this.dom.spanModalDetails.textContent = JSON.stringify({
        trace_id: this.dom.currentTraceId ? this.dom.currentTraceId.textContent : 'tr-8f49b21e0a84',
        span_id: span.id,
        service_name: span.svc,
        operation: span.op,
        start_offset_ms: span.start,
        duration_ms: span.duration,
        http_status: span.status,
        tags: span.tags
      }, null, 2);

      this.dom.spanModal.classList.remove('hidden');
      this.audio.playClick();
    }

    appendTerminalLog(msg) {
      const line = document.createElement('div');
      line.className = 'term-line ' + (msg.includes('SUCCESS') ? 'success' : msg.includes('FATAL') || msg.includes('ERROR') ? 'alert' : msg.includes('EXEC') ? 'exec' : 'info');
      line.textContent = msg;
      this.dom.terminalScreen.appendChild(line);
      this.dom.terminalScreen.scrollTop = this.dom.terminalScreen.scrollHeight;
    }

    openPostMortemModal() {
      const scenario = this.engine.activeScenario;
      const md = `
# 📑 Incident Post-Mortem: ${scenario === 'nominal' ? 'Routine SLO Verification' : scenario.toUpperCase()}
**Date:** ${new Date().toISOString()}  
**Cluster:** PROD • us-east-1  
**Incident Severity:** ${scenario === 'nominal' ? 'P4 - INFO' : 'P1 - CRITICAL'}  
**Mean Time to Detect (MTTD):** 1.2s  
**Mean Time to Remediate (MTTR):** 16.4s  
**SLO Impact:** 99.982% (Budget Remaining: 97.4%)

---

### 1. Executive Summary
During peak traffic, automated observability alarms triggered in region **us-east-1**. Latency tail P99 breached the 120ms SLA threshold, reaching peak values of ${this.engine.state.latencyP99}ms. PulseMetrics automated runbook engine was invoked.

### 2. Root Cause Analysis (RCA)
- **Component:** \`postgres-db (Aurora Cluster)\` & \`checkout-core-api\`
- **Trigger:** Heavy transaction concurrency caused connection pool starvation.
- **Cascading Failure:** Connection pool exhaustion stalled worker threads, leading to HTTP 504 timeouts at the ingress proxy.

### 3. Timeline of Events
- \`T+00:00:00\` — Initial anomaly identified by Prometheus counter drift.
- \`T+00:00:02\` — War-Room alert broadcast; circuit breaker tripped on /checkout.
- \`T+00:00:07\` — Automated runbook \`RB-AURORA-POOL-DRAIN\` executed.
- \`T+00:00:14\` — Idle backends terminated; read-replica load balancing restored.
- \`T+00:00:16\` — P99 latency recovered to nominal 42ms; incident marked RESOLVED.

### 4. Corrective Action Items
- [x] Increase default connection pool size in PgBouncer config to 4000.
- [ ] Implement adaptive rate-limiting token buckets at Kong Ingress.
- [ ] Add pre-warming scaling rules for Black Friday traffic surges.
      `.trim();

      this.dom.postmortemContent.textContent = md;
      this.dom.postmortemModal.classList.remove('hidden');
      this.audio.playClick();
    }

    downloadPostMortemFile() {
      const text = this.dom.postmortemContent.textContent;
      const blob = new Blob([text], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pulsemetrics-postmortem-${Date.now()}.md`;
      a.click();
      URL.revokeObjectURL(url);
      this.showToast('Post-mortem markdown downloaded.');
    }

    captureCanvasSnapshot() {
      const snapCanvas = document.createElement('canvas');
      snapCanvas.width = 1200;
      snapCanvas.height = 700;
      const ctx = snapCanvas.getContext('2d');

      // Dark background
      ctx.fillStyle = '#060911';
      ctx.fillRect(0, 0, 1200, 700);

      // Title & Watermark
      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 24px Outfit, sans-serif';
      ctx.fillText('PULSEMETRICS MISSION CONTROL — TELEMETRY SNAPSHOT', 40, 50);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px "JetBrains Mono", monospace';
      ctx.fillText(`Timestamp: ${new Date().toUTCString()} • Cluster: PROD (us-east-1)`, 40, 75);
      ctx.fillText(`Global RPS: ${this.engine.state.rps} • P99: ${this.engine.state.latencyP99}ms • Error Rate: ${this.engine.state.errorRate}%`, 40, 100);

      // Draw latency stream
      if (this.dom.latencyStreamCanvas) {
        ctx.drawImage(this.dom.latencyStreamCanvas, 40, 130, 1120, 260);
      }

      // Draw topology
      if (this.dom.topologyCanvas) {
        ctx.drawImage(this.dom.topologyCanvas, 40, 410, 1120, 250);
      }

      const url = snapCanvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `pulsemetrics-snapshot-${Date.now()}.png`;
      a.click();
      this.showToast('High-resolution canvas snapshot saved to PNG!');
    }

    showToast(message) {
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = `<span>⚡</span> <span>${message}</span>`;
      this.dom.toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    }
  }

  // Auto-launch on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    window.pulseMetricsApp = new PulseMetricsApp();
  });

})();
