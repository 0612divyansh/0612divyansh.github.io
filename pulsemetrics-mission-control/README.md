# ⚡ PulseMetrics Mission Control

> **Real-Time Developer Observability & Incident War-Room Command Center**  
> *Production-grade telemetry radar, live service mesh topology, 60-bucket latency distribution heatmaps, OpenTelemetry distributed trace waterfalls, and automated runbook self-healing.*

[![Live Demo](https://img.shields.io/badge/Live_Demo-0612divyansh.github.io%2Fpulsemetrics--mission--control-06b6d4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://0612divyansh.github.io/pulsemetrics-mission-control/)
[![GitHub](https://img.shields.io/badge/GitHub-0612divyansh%2Fpulsemetrics--mission--control-8b5cf6?style=for-the-badge&logo=github&logoColor=white)](https://github.com/0612divyansh/pulsemetrics-mission-control)
[![License](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0_Zero-f59e0b?style=for-the-badge)](#features)

---

## 🚀 Overview

**PulseMetrics Mission Control** is a developer-first cloud observability and incident response suite engineered for SREs, DevOps engineers, and distributed systems architects. It bridges the gap between high-frequency metric ingestion and real-time automated incident remediation without desktop bloat or heavy agent overhead.

Zero external framework runtimes. Pure Vanilla HTML5, CSS3, JavaScript, Canvas 2D, and Web Audio API.

---

## ⚡ Highlights & Key Capabilities

- 🌐 **Interactive Service Mesh Topology**: Real-time canvas graph with dynamic bezier conduits, animated particle velocity, node health halos, and flyout telemetry drawers for all 8 microservices.
- 📈 **Real-Time Multi-Curve Telemetry**: 60fps streaming canvas charts for P99/P95/P50 latency curves with dynamic SLO threshold lines (120ms target).
- 🗺️ **60-Bucket Regional Heatmap**: Rolling multi-region latency quantile heatmap spanning `us-east-1`, `us-west-2`, `eu-central-1`, `ap-south-1`, and `sa-east-1`.
- 💥 **Chaos Engineering & Incident War-Room**: 5 real-time chaos injection scenarios (Aurora DB connection pool exhaustion, regional fiber transit cut, worker memory leak, Layer-7 DDoS flood, and steady state).
- 🤖 **Automated Runbook Orchestrator**: Bash-style interactive terminal simulator that detects metric anomalies, isolates blast radius via circuit breakers, drains connection pools, and verifies SLO recovery.
- 🔍 **Distributed Trace Waterfall**: OpenTelemetry-style span visualization with microservice hops, latency breakdowns, and structured span tag inspection.
- 📋 **Streaming Structured JSON Logs**: Real-time logging engine with regex filtering, severity pills (`INFO`, `WARN`, `ERROR`, `FATAL`), and pause/resume capabilities.
- 🔊 **Native Web Audio Synthesizer**: Generates UI clicks, telemetry blips, war-room alert sirens, and harmonic resolution arpeggios directly in the browser with persistent mute toggle.
- 📑 **Automated Post-Mortem Generator**: Generates comprehensive incident Root Cause Analysis (RCA) reports with 1-click Markdown copy and `.md` file download.
- 📸 **High-Resolution Telemetry Snapshot**: 1-click 1200x700 PNG snapshot generator for Slack war-rooms and incident documentation.

---

## 🧩 Microservice Fleet Architecture

```
                       ┌─────────────────────────┐
                       │   Edge API Gateway      │
                       │   (Kong / Envoy Ingress)│
                       └────────────┬────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
       ┌────────────────────┐              ┌────────────────────┐
       │  Auth IAM Service  │              │  Checkout Core API │
       │  (OAuth2 / JWT)    │              │  (Node.js / Express│
       └──────────┬─────────┘              └──────────┬─────────┘
                  │                                   │
                  ├─────────────────┬─────────────────┤
                  ▼                 ▼                 ▼
       ┌────────────────────┐ ┌──────────┐ ┌────────────────────┐
       │ Distributed Cache  │ │ Postgres │ │ Payment Gateway    │
       │ (Redis 7 Cluster)  │ │ (Aurora) │ │ (Stripe & Ledger)  │
       └────────────────────┘ └──────────┘ └──────────┬─────────┘
                                                       │
                                                       ▼
                                            ┌────────────────────┐
                                            │ Kafka Event Bus    │
                                            │ (Stream Ingestion) │
                                            └────────────────────┘
```

---

## 🛠️ Quick Local Setup

No `npm install`, dependencies, or build tools required.

```bash
# Clone repository
git clone https://github.com/0612divyansh/pulsemetrics-mission-control.git
cd pulsemetrics-mission-control

# Open in browser
open index.html
```

Or run with a local Python HTTP server:

```bash
python3 -m http.server 3000
# Navigate to http://localhost:3000
```

---

## 🌐 Deployment

### GitHub Pages (Included Workflow)
This project is configured with `.github/workflows/deploy.yml` for automated GitHub Pages continuous deployment.

### Vercel / Netlify
A `vercel.json` file is included for instant edge deployment.

---

## 📜 License

MIT License © 2026 [Divyansh Shandil](https://github.com/0612divyansh)
