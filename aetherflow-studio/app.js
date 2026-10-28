/**
 * AETHERFLOW STUDIO — CORE APPLICATION ENGINE
 * High-performance visual node canvas, Web Audio synth, real-time DAG simulator & code generator.
 */

(function () {
  'use strict';

  // ============================================================================
  // 1. WEB AUDIO SYNTHESIZER ENGINE (Pure Native, Zero Dependencies)
  // ============================================================================
  class AudioSynth {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      const saved = localStorage.getItem('aetherflow_sound_enabled');
      if (saved !== null) this.enabled = saved === 'true';
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.ctx = new AudioContext();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('aetherflow_sound_enabled', this.enabled.toString());
      return this.enabled;
    }

    playConnect() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } catch (e) {}
    }

    playDisconnect() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.09);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      } catch (e) {}
    }

    playStep() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(587.33, now); // D5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
      } catch (e) {}
    }

    playSuccess() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      try {
        const chord = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
        chord.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          const now = this.ctx.currentTime + idx * 0.05;
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.3);
        });
      } catch (e) {}
    }
  }

  // ============================================================================
  // 2. NODE METADATA & FACTORY
  // ============================================================================
  const NODE_TYPES = {
    'llm-agent': {
      title: 'LLM Synthesizer',
      icon: '🤖',
      category: 'agent',
      inputs: ['input'],
      outputs: ['output'],
      defaultConfig: {
        model: 'gemini-1.5-pro',
        prompt: 'Analyze input vulnerabilities and generate automated patch steps in structured format.',
        temperature: '0.4',
        maxTokens: '1024'
      }
    },
    'classifier': {
      title: 'Intent Classifier',
      icon: '🧠',
      category: 'agent',
      inputs: ['input'],
      outputs: ['output'],
      defaultConfig: {
        model: 'sentiment-v2',
        labels: 'Critical, High, Medium, Low',
        confidence: '0.85'
      }
    },
    'webhook-trigger': {
      title: 'Webhook Trigger',
      icon: '⚡',
      category: 'trigger',
      inputs: [],
      outputs: ['output'],
      defaultConfig: {
        method: 'POST',
        endpoint: '/api/v1/github/events',
        auth: 'Bearer Token'
      }
    },
    'web-scraper': {
      title: 'Web Scraper',
      icon: '🌐',
      category: 'trigger',
      inputs: ['input'],
      outputs: ['output'],
      defaultConfig: {
        url: 'https://github.com/0612divyansh',
        selector: 'article.repository-content',
        cleanMarkdown: 'true'
      }
    },
    'cron-schedule': {
      title: 'Cron Schedule',
      icon: '⏱️',
      category: 'trigger',
      inputs: [],
      outputs: ['output'],
      defaultConfig: {
        cron: '0 6 * * *',
        timezone: 'UTC'
      }
    },
    'condition-branch': {
      title: 'Condition Branch',
      icon: '🔀',
      category: 'logic',
      inputs: ['input'],
      outputs: ['true', 'false'],
      defaultConfig: {
        expression: 'payload.severity === "CRITICAL" || payload.cve_count > 0',
        evalMode: 'JavaScript'
      }
    },
    'vector-memory': {
      title: 'Vector Memory (RAG)',
      icon: '💾',
      category: 'logic',
      inputs: ['input'],
      outputs: ['output'],
      defaultConfig: {
        collection: 'secops-knowledge-base',
        topK: '4',
        similarityCutoff: '0.78'
      }
    },
    'code-transform': {
      title: 'Python / JS Runner',
      icon: '🐍',
      category: 'logic',
      inputs: ['input'],
      outputs: ['output'],
      defaultConfig: {
        runtime: 'Python 3.12',
        code: 'def transform(data):\n    return {"audit_score": 98.4, "status": "APPROVED"}'
      }
    },
    'slack-alert': {
      title: 'Slack / Discord Alert',
      icon: '💬',
      category: 'action',
      inputs: ['input'],
      outputs: [],
      defaultConfig: {
        channel: '#secops-alerts',
        urgency: 'HIGH',
        mentions: '@security-lead'
      }
    },
    'github-action': {
      title: 'GitHub PR / Issue',
      icon: '🐙',
      category: 'action',
      inputs: ['input'],
      outputs: [],
      defaultConfig: {
        repository: '0612divyansh/aetherflow-studio',
        action: 'Create Auto-Patch Pull Request',
        branch: 'fix/cve-remediation'
      }
    }
  };

  // ============================================================================
  // 3. PRE-BUILT SHOWCASE TEMPLATES
  // ============================================================================
  const TEMPLATES = {
    'secops': {
      name: 'Autonomous SecOps Auditor Pipeline',
      nodes: [
        { id: 'node_1', type: 'webhook-trigger', x: 80, y: 140, config: { method: 'POST', endpoint: '/events/git/push', auth: 'HMAC-SHA256' } },
        { id: 'node_2', type: 'llm-agent', x: 400, y: 120, config: { model: 'gemini-1.5-pro', prompt: 'Audit incoming git commit diff for CVE vulnerabilities, exposed secrets, and AST anomalies.', temperature: '0.2', maxTokens: '1024' } },
        { id: 'node_3', type: 'condition-branch', x: 740, y: 130, config: { expression: 'payload.vulnerabilities_detected === true', evalMode: 'JavaScript' } },
        { id: 'node_4', type: 'github-action', x: 1080, y: 80, config: { repository: '0612divyansh/aetherflow-studio', action: 'Create Auto-Patch Pull Request', branch: 'fix/security-remediation' } },
        { id: 'node_5', type: 'slack-alert', x: 1080, y: 260, config: { channel: '#secops-notifications', urgency: 'INFO', mentions: '@all' } }
      ],
      connections: [
        { id: 'c1', fromNode: 'node_1', fromPort: 'output', toNode: 'node_2', toPort: 'input' },
        { id: 'c2', fromNode: 'node_2', fromPort: 'output', toNode: 'node_3', toPort: 'input' },
        { id: 'c3', fromNode: 'node_3', fromPort: 'true', toNode: 'node_4', toPort: 'input' },
        { id: 'c4', fromNode: 'node_3', fromPort: 'false', toNode: 'node_5', toPort: 'input' }
      ]
    },
    'lead-gen': {
      name: 'Autonomous Growth & Lead Enrichment Pipeline',
      nodes: [
        { id: 'lg_1', type: 'webhook-trigger', x: 80, y: 150, config: { method: 'POST', endpoint: '/leads/inbound', auth: 'Bearer Token' } },
        { id: 'lg_2', type: 'web-scraper', x: 380, y: 140, config: { url: 'https://company.domain/about', selector: 'main, meta', cleanMarkdown: 'true' } },
        { id: 'lg_3', type: 'llm-agent', x: 700, y: 130, config: { model: 'claude-3-5-sonnet', prompt: 'Analyze company size, tech stack, and compute ICP match score (0-100).', temperature: '0.3', maxTokens: '512' } },
        { id: 'lg_4', type: 'condition-branch', x: 1020, y: 140, config: { expression: 'payload.icp_score >= 80', evalMode: 'JavaScript' } },
        { id: 'lg_5', type: 'slack-alert', x: 1340, y: 90, config: { channel: '#enterprise-leads', urgency: 'HIGH', mentions: '@founders' } },
        { id: 'lg_6', type: 'vector-memory', x: 1340, y: 250, config: { collection: 'nurture-drip-pool', topK: '2', similarityCutoff: '0.8' } }
      ],
      connections: [
        { id: 'lc1', fromNode: 'lg_1', fromPort: 'output', toNode: 'lg_2', toPort: 'input' },
        { id: 'lc2', fromNode: 'lg_2', fromPort: 'output', toNode: 'lg_3', toPort: 'input' },
        { id: 'lc3', fromNode: 'lg_3', fromPort: 'output', toNode: 'lg_4', toPort: 'input' },
        { id: 'lc4', fromNode: 'lg_4', fromPort: 'true', toNode: 'lg_5', toPort: 'input' },
        { id: 'lc5', fromNode: 'lg_4', fromPort: 'false', toNode: 'lg_6', toPort: 'input' }
      ]
    },
    'research': {
      name: 'Deep Tech & AI Research Synthesizer',
      nodes: [
        { id: 'res_1', type: 'cron-schedule', x: 80, y: 150, config: { cron: '0 6 * * *', timezone: 'UTC' } },
        { id: 'res_2', type: 'web-scraper', x: 380, y: 140, config: { url: 'https://arxiv.org/list/cs.AI/recent', selector: '.list-title', cleanMarkdown: 'true' } },
        { id: 'res_3', type: 'vector-memory', x: 700, y: 140, config: { collection: 'ai-breakthroughs', topK: '5', similarityCutoff: '0.82' } },
        { id: 'res_4', type: 'llm-agent', x: 1020, y: 130, config: { model: 'gpt-4o', prompt: 'Synthesize the top 3 high-impact AI papers into a high-level briefing with code repos.', temperature: '0.5', maxTokens: '2048' } },
        { id: 'res_5', type: 'slack-alert', x: 1340, y: 140, config: { channel: '#engineering-digest', urgency: 'INFO', mentions: '@team' } }
      ],
      connections: [
        { id: 'rc1', fromNode: 'res_1', fromPort: 'output', toNode: 'res_2', toPort: 'input' },
        { id: 'rc2', fromNode: 'res_2', fromPort: 'output', toNode: 'res_3', toPort: 'input' },
        { id: 'rc3', fromNode: 'res_3', fromPort: 'output', toNode: 'res_4', toPort: 'input' },
        { id: 'rc4', fromNode: 'res_4', fromPort: 'output', toNode: 'res_5', toPort: 'input' }
      ]
    },
    'support': {
      name: 'Customer Support Auto-Pilot & Escalation',
      nodes: [
        { id: 'sup_1', type: 'webhook-trigger', x: 80, y: 140, config: { method: 'POST', endpoint: '/tickets/inbound', auth: 'HMAC-SHA256' } },
        { id: 'sup_2', type: 'classifier', x: 380, y: 130, config: { model: 'intent-sentiment-v2', labels: 'Urgent/Frustrated, Billing, General Query', confidence: '0.88' } },
        { id: 'sup_3', type: 'condition-branch', x: 700, y: 140, config: { expression: 'payload.sentiment === "Frustrated" || payload.is_vip === true', evalMode: 'JavaScript' } },
        { id: 'sup_4', type: 'slack-alert', x: 1040, y: 80, config: { channel: '#urgent-escalations', urgency: 'P1', mentions: '@duty-manager' } },
        { id: 'sup_5', type: 'llm-agent', x: 1040, y: 240, config: { model: 'gemini-1.5-pro', prompt: 'Draft a friendly, helpful, step-by-step resolution referencing knowledge base.', temperature: '0.3', maxTokens: '600' } }
      ],
      connections: [
        { id: 'sc1', fromNode: 'sup_1', fromPort: 'output', toNode: 'sup_2', toPort: 'input' },
        { id: 'sc2', fromNode: 'sup_2', fromPort: 'output', toNode: 'sup_3', toPort: 'input' },
        { id: 'sc3', fromNode: 'sup_3', fromPort: 'true', toNode: 'sup_4', toPort: 'input' },
        { id: 'sc4', fromNode: 'sup_3', fromPort: 'false', toNode: 'sup_5', toPort: 'input' }
      ]
    },
    'blank': {
      name: 'New Untitled Flow',
      nodes: [],
      connections: []
    }
  };

  // ============================================================================
  // 4. MAIN APP CONTROLLER
  // ============================================================================
  class AetherFlowApp {
    constructor() {
      this.synth = new AudioSynth();
      this.nodes = new Map();
      this.connections = [];
      this.workflowName = 'Autonomous SecOps Auditor Pipeline';
      
      // Canvas Pan & Zoom
      this.view = { x: 40, y: 40, zoom: 1 };
      this.isPanning = false;
      this.panStart = { x: 0, y: 0 };
      
      // Dragging Nodes
      this.activeDraggedNode = null;
      this.dragOffset = { x: 0, y: 0 };

      // Wiring connection
      this.activeConnecting = null; // { nodeId, portType, portName, startX, startY }

      // Selection & Execution
      this.selectedNodeId = null;
      this.isExecuting = false;
      this.executionMetrics = { time: 0, tokens: 0, cost: 0, activeCount: 0 };

      // DOM Elements
      this.dom = {
        viewport: document.getElementById('canvas-viewport'),
        layer: document.getElementById('canvas-transform-layer'),
        nodesContainer: document.getElementById('nodes-container'),
        svg: document.getElementById('connections-svg'),
        wiresGroup: document.getElementById('wires-group'),
        tempWire: document.getElementById('temp-wire'),
        zoomText: document.getElementById('zoom-level-text'),
        minimapCanvas: document.getElementById('minimap-canvas'),
        minimapViewport: document.getElementById('minimap-viewport'),
        statusChip: document.getElementById('canvas-node-count-display'),
        soundToggleBtn: document.getElementById('btn-toggle-sound'),
        soundIndicator: document.getElementById('sound-indicator'),
        nameInput: document.getElementById('workflow-name-input'),
        saveStatus: document.getElementById('save-status'),
        templateSelect: document.getElementById('template-select'),
        runBtn: document.getElementById('btn-run-workflow'),
        runIcon: document.getElementById('run-icon'),
        runSpinner: document.getElementById('run-spinner'),
        runText: document.getElementById('run-text'),
        logContainer: document.getElementById('stream-log-container'),
        logCountBadge: document.getElementById('log-count-badge'),
        telemetryDock: document.getElementById('telemetry-dock'),
        metricTime: document.getElementById('metric-exec-time'),
        metricTokens: document.getElementById('metric-token-count'),
        metricBreakdown: document.getElementById('metric-token-breakdown'),
        metricCost: document.getElementById('metric-cost-estimate'),
        metricActive: document.getElementById('metric-nodes-active'),
        inspectorSelect: document.getElementById('inspector-node-select'),
        inspectorViewer: document.getElementById('inspector-json-viewer'),
        cmdDialog: document.getElementById('cmd-dialog'),
        cmdInput: document.getElementById('cmd-search-input'),
        cmdResults: document.getElementById('cmd-results-list'),
        codeDialog: document.getElementById('code-dialog'),
        codeDisplay: document.getElementById('generated-code-display'),
        projectDialog: document.getElementById('project-dialog'),
        toastContainer: document.getElementById('toast-container')
      };

      this.init();
    }

    init() {
      // 1. Setup Sound Icon
      this.updateSoundIcon();

      // 2. Load LocalStorage or Default Template
      this.loadPersistedWorkflow();

      // 3. Bind UI & Canvas Events
      this.bindCanvasEvents();
      this.bindPaletteEvents();
      this.bindHeaderActions();
      this.bindDockEvents();
      this.bindModals();
      this.bindKeyboardShortcuts();

      // 4. Initial Render
      this.applyViewTransform();
      this.renderMinimap();
      this.updateInspectorOptions();

      // Log welcome
      this.appendLog('system', `AetherFlow Studio ready. Loaded "${this.workflowName}" with ${this.nodes.size} nodes.`);
    }

    // ==========================================================================
    // PERSISTENCE & TEMPLATES
    // ==========================================================================
    loadPersistedWorkflow() {
      const saved = localStorage.getItem('aetherflow_project_state');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          this.loadWorkflowData(data);
          return;
        } catch (e) {
          console.warn('Could not parse saved workflow:', e);
        }
      }
      // Fallback: SecOps Template
      this.loadTemplate('secops');
    }

    saveToLocalStorage() {
      const data = this.serializeWorkflow();
      localStorage.setItem('aetherflow_project_state', JSON.stringify(data));
      this.flashSaveIndicator();
    }

    flashSaveIndicator() {
      if (this.dom.saveStatus) {
        this.dom.saveStatus.innerHTML = '<span class="status-dot"></span> Saved';
        this.dom.saveStatus.style.opacity = '1';
      }
    }

    loadTemplate(templateKey) {
      const tpl = TEMPLATES[templateKey];
      if (!tpl) return;
      this.loadWorkflowData(tpl);
      this.workflowName = tpl.name;
      if (this.dom.nameInput) this.dom.nameInput.value = tpl.name;
      this.saveToLocalStorage();
      this.showToast(`Loaded template: ${tpl.name}`, 'info');
    }

    loadWorkflowData(data) {
      this.nodes.clear();
      this.connections = [];
      this.dom.nodesContainer.innerHTML = '';
      this.dom.wiresGroup.innerHTML = '';

      if (data.name) {
        this.workflowName = data.name;
        if (this.dom.nameInput) this.dom.nameInput.value = data.name;
      }

      if (Array.isArray(data.nodes)) {
        data.nodes.forEach(n => {
          this.createNode(n.type, n.x, n.y, n.id, n.config);
        });
      }

      if (Array.isArray(data.connections)) {
        data.connections.forEach(c => {
          this.connections.push({
            id: c.id || `wire_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            fromNode: c.fromNode,
            fromPort: c.fromPort,
            toNode: c.toNode,
            toPort: c.toPort
          });
        });
      }

      this.renderAllWires();
      this.updateStatusChip();
      this.renderMinimap();
      this.updateInspectorOptions();
    }

    serializeWorkflow() {
      const nodesArr = [];
      this.nodes.forEach(node => {
        nodesArr.push({
          id: node.id,
          type: node.type,
          x: node.x,
          y: node.y,
          config: { ...node.config }
        });
      });

      return {
        name: this.workflowName,
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        nodes: nodesArr,
        connections: [...this.connections]
      };
    }

    // ==========================================================================
    // NODE MANAGEMENT
    // ==========================================================================
    createNode(type, x, y, customId = null, initialConfig = null) {
      const meta = NODE_TYPES[type];
      if (!meta) return null;

      const id = customId || `node_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      const config = { ...meta.defaultConfig, ...(initialConfig || {}) };

      const nodeObj = {
        id,
        type,
        title: meta.title,
        icon: meta.icon,
        category: meta.category,
        inputs: meta.inputs,
        outputs: meta.outputs,
        x: Math.round(x),
        y: Math.round(y),
        config,
        status: 'idle',
        metrics: { latency: 0, tokens: 0 },
        outputData: null,
        domElement: null
      };

      // Construct DOM Element
      const el = document.createElement('div');
      el.className = `flow-node node-cat-${meta.category}`;
      el.id = id;
      el.style.transform = `translate(${nodeObj.x}px, ${nodeObj.y}px)`;

      // Node Header
      const header = document.createElement('div');
      header.className = 'node-header';
      header.innerHTML = `
        <div class="node-title-group">
          <span class="node-icon">${meta.icon}</span>
          <span class="node-title">${meta.title}</span>
        </div>
        <div class="node-actions">
          <button type="button" class="node-act-btn btn-delete" title="Delete node (Del)">✕</button>
        </div>
      `;

      // Node Body Config
      const body = document.createElement('div');
      body.className = 'node-body';
      this.renderNodeConfigFields(body, nodeObj);

      // Node Ports
      const portsWrapper = document.createElement('div');
      portsWrapper.className = 'node-ports-wrapper';

      // Input Ports
      meta.inputs.forEach(portName => {
        const port = document.createElement('div');
        port.className = 'node-port port-input';
        port.dataset.nodeId = id;
        port.dataset.portType = 'input';
        port.dataset.portName = portName;
        port.title = `Input: ${portName}`;
        portsWrapper.appendChild(port);
      });

      // Output Ports
      meta.outputs.forEach(portName => {
        const port = document.createElement('div');
        let portClass = 'node-port port-output';
        if (portName === 'true') portClass += ' port-output-true';
        if (portName === 'false') portClass += ' port-output-false';
        
        port.className = portClass;
        port.dataset.nodeId = id;
        port.dataset.portType = 'output';
        port.dataset.portName = portName;
        port.title = `Output: ${portName}`;
        portsWrapper.appendChild(port);

        // Optional label tag for conditional branches
        if (portName === 'true' || portName === 'false') {
          const label = document.createElement('span');
          label.className = `port-label-tag label-${portName}`;
          label.textContent = portName;
          portsWrapper.appendChild(label);
        }
      });

      // Node Footer Status
      const footer = document.createElement('div');
      footer.className = 'node-footer';
      footer.innerHTML = `
        <div class="node-status-badge">
          <span class="status-indicator-dot"></span>
          <span class="status-label">IDLE</span>
        </div>
        <span class="node-metrics">0ms</span>
      `;

      el.appendChild(header);
      el.appendChild(body);
      el.appendChild(portsWrapper);
      el.appendChild(footer);

      // Node Interactions
      this.bindNodeEvents(el, nodeObj);

      nodeObj.domElement = el;
      this.dom.nodesContainer.appendChild(el);
      this.nodes.set(id, nodeObj);

      this.updateStatusChip();
      this.renderMinimap();
      this.updateInspectorOptions();

      return nodeObj;
    }

    renderNodeConfigFields(container, node) {
      container.innerHTML = '';

      if (node.type === 'llm-agent') {
        container.innerHTML = `
          <div class="node-field">
            <label class="field-label">Model Engine</label>
            <select class="node-select" data-key="model">
              <option value="gemini-1.5-pro" ${node.config.model === 'gemini-1.5-pro' ? 'selected' : ''}>Gemini 1.5 Pro</option>
              <option value="claude-3-5-sonnet" ${node.config.model === 'claude-3-5-sonnet' ? 'selected' : ''}>Claude 3.5 Sonnet</option>
              <option value="gpt-4o" ${node.config.model === 'gpt-4o' ? 'selected' : ''}>GPT-4o</option>
              <option value="llama-3.3-70b" ${node.config.model === 'llama-3.3-70b' ? 'selected' : ''}>Llama 3.3 70B</option>
            </select>
          </div>
          <div class="node-field">
            <label class="field-label">System Prompt Template</label>
            <textarea class="node-textarea" data-key="prompt" rows="3">${node.config.prompt || ''}</textarea>
          </div>
        `;
      } else if (node.type === 'webhook-trigger') {
        container.innerHTML = `
          <div class="node-field">
            <label class="field-label">Method & Path</label>
            <input type="text" class="node-input" data-key="endpoint" value="${node.config.endpoint || ''}">
          </div>
          <div class="node-field">
            <label class="field-label">Auth Protocol</label>
            <input type="text" class="node-input" data-key="auth" value="${node.config.auth || 'Bearer Token'}">
          </div>
        `;
      } else if (node.type === 'condition-branch') {
        container.innerHTML = `
          <div class="node-field">
            <label class="field-label">Branch Rule (Boolean Expression)</label>
            <textarea class="node-textarea" data-key="expression" rows="2">${node.config.expression || ''}</textarea>
          </div>
        `;
      } else if (node.type === 'vector-memory') {
        container.innerHTML = `
          <div class="node-field">
            <label class="field-label">Index / Collection</label>
            <input type="text" class="node-input" data-key="collection" value="${node.config.collection || ''}">
          </div>
          <div class="node-field">
            <label class="field-label">Top-K Vectors</label>
            <input type="number" class="node-input" data-key="topK" value="${node.config.topK || 4}" min="1" max="20">
          </div>
        `;
      } else if (node.type === 'slack-alert') {
        container.innerHTML = `
          <div class="node-field">
            <label class="field-label">Broadcast Channel</label>
            <input type="text" class="node-input" data-key="channel" value="${node.config.channel || ''}">
          </div>
          <div class="node-field">
            <label class="field-label">Urgency Level</label>
            <select class="node-select" data-key="urgency">
              <option value="CRITICAL" ${node.config.urgency === 'CRITICAL' ? 'selected' : ''}>CRITICAL</option>
              <option value="HIGH" ${node.config.urgency === 'HIGH' ? 'selected' : ''}>HIGH</option>
              <option value="INFO" ${node.config.urgency === 'INFO' ? 'selected' : ''}>INFO</option>
            </select>
          </div>
        `;
      } else if (node.type === 'github-action') {
        container.innerHTML = `
          <div class="node-field">
            <label class="field-label">Repository</label>
            <input type="text" class="node-input" data-key="repository" value="${node.config.repository || ''}">
          </div>
          <div class="node-field">
            <label class="field-label">Automated Action</label>
            <input type="text" class="node-input" data-key="action" value="${node.config.action || ''}">
          </div>
        `;
      } else {
        // Generic inputs
        const keys = Object.keys(node.config);
        keys.forEach(k => {
          const field = document.createElement('div');
          field.className = 'node-field';
          field.innerHTML = `
            <label class="field-label">${k}</label>
            <input type="text" class="node-input" data-key="${k}" value="${node.config[k]}">
          `;
          container.appendChild(field);
        });
      }

      // Bind config change inputs
      container.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', (e) => {
          const key = e.target.dataset.key;
          node.config[key] = e.target.value;
          this.saveToLocalStorage();
        });
      });
    }

    deleteNode(nodeId) {
      const node = this.nodes.get(nodeId);
      if (!node) return;

      // Remove DOM
      if (node.domElement && node.domElement.parentNode) {
        node.domElement.parentNode.removeChild(node.domElement);
      }

      // Remove connections
      this.connections = this.connections.filter(c => c.fromNode !== nodeId && c.toNode !== nodeId);
      this.nodes.delete(nodeId);

      this.synth.playDisconnect();
      this.renderAllWires();
      this.updateStatusChip();
      this.renderMinimap();
      this.updateInspectorOptions();
      this.saveToLocalStorage();
      this.showToast(`Deleted ${node.title}`, 'info');
    }

    selectNode(nodeId) {
      if (this.selectedNodeId && this.nodes.has(this.selectedNodeId)) {
        this.nodes.get(this.selectedNodeId).domElement.classList.remove('selected');
      }
      this.selectedNodeId = nodeId;
      if (nodeId && this.nodes.has(nodeId)) {
        this.nodes.get(nodeId).domElement.classList.add('selected');
        if (this.dom.inspectorSelect) {
          this.dom.inspectorSelect.value = nodeId;
          this.renderInspectorOutput(nodeId);
        }
      }
    }

    // ==========================================================================
    // CANVAS INTERACTIONS, PANNING & ZOOMING
    // ==========================================================================
    bindCanvasEvents() {
      const vp = this.dom.viewport;

      // Pointer down on canvas for Pan
      vp.addEventListener('pointerdown', (e) => {
        // Only if target is background viewport
        if (e.target === vp || e.target === this.dom.layer || e.target === this.dom.svg) {
          this.isPanning = true;
          this.panStart = { x: e.clientX - this.view.x, y: e.clientY - this.view.y };
          vp.classList.add('panning');
          this.selectNode(null);
        }
      });

      window.addEventListener('pointermove', (e) => {
        // 1. Panning Canvas
        if (this.isPanning) {
          this.view.x = e.clientX - this.panStart.x;
          this.view.y = e.clientY - this.panStart.y;
          this.applyViewTransform();
          this.renderMinimap();
          return;
        }

        // 2. Dragging Node
        if (this.activeDraggedNode) {
          const clientX = e.clientX;
          const clientY = e.clientY;
          const vpRect = vp.getBoundingClientRect();
          
          const worldX = (clientX - vpRect.left - this.view.x) / this.view.zoom;
          const worldY = (clientY - vpRect.top - this.view.y) / this.view.zoom;

          this.activeDraggedNode.x = Math.round(worldX - this.dragOffset.x);
          this.activeDraggedNode.y = Math.round(worldY - this.dragOffset.y);

          this.activeDraggedNode.domElement.style.transform = `translate(${this.activeDraggedNode.x}px, ${this.activeDraggedNode.y}px)`;
          this.renderAllWires();
          this.renderMinimap();
          return;
        }

        // 3. Drawing Temp Connection Wire
        if (this.activeConnecting) {
          const vpRect = vp.getBoundingClientRect();
          const targetX = (e.clientX - vpRect.left - this.view.x) / this.view.zoom;
          const targetY = (e.clientY - vpRect.top - this.view.y) / this.view.zoom;
          
          this.drawTempWire(this.activeConnecting.startX, this.activeConnecting.startY, targetX, targetY);
        }
      });

      window.addEventListener('pointerup', (e) => {
        if (this.isPanning) {
          this.isPanning = false;
          vp.classList.remove('panning');
        }

        if (this.activeDraggedNode) {
          this.activeDraggedNode = null;
          this.saveToLocalStorage();
        }

        if (this.activeConnecting) {
          // If dropped over a valid input port
          const targetPort = e.target.closest('.node-port');
          if (targetPort && targetPort.dataset.portType === 'input') {
            const toNodeId = targetPort.dataset.nodeId;
            const toPortName = targetPort.dataset.portName;

            if (toNodeId !== this.activeConnecting.nodeId) {
              this.createConnection(this.activeConnecting.nodeId, this.activeConnecting.portName, toNodeId, toPortName);
            }
          }
          this.activeConnecting = null;
          this.dom.tempWire.setAttribute('d', '');
        }
      });

      // Zoom via Mouse Wheel
      vp.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        this.setZoom(this.view.zoom * delta, e.clientX, e.clientY);
      }, { passive: false });
    }

    setZoom(newZoom, centerX = null, centerY = null) {
      const clamped = Math.min(Math.max(newZoom, 0.35), 2.2);
      const vp = this.dom.viewport;
      const vpRect = vp.getBoundingClientRect();

      const cx = centerX !== null ? centerX - vpRect.left : vpRect.width / 2;
      const cy = centerY !== null ? centerY - vpRect.top : vpRect.height / 2;

      // Adjust view.x and view.y so center point remains stable under cursor
      const worldX = (cx - this.view.x) / this.view.zoom;
      const worldY = (cy - this.view.y) / this.view.zoom;

      this.view.zoom = clamped;
      this.view.x = cx - worldX * this.view.zoom;
      this.view.y = cy - worldY * this.view.zoom;

      this.applyViewTransform();
      this.renderMinimap();
      if (this.dom.zoomText) {
        this.dom.zoomText.textContent = `${Math.round(this.view.zoom * 100)}%`;
      }
    }

    applyViewTransform() {
      this.dom.layer.style.transform = `translate(${this.view.x}px, ${this.view.y}px) scale(${this.view.zoom})`;
    }

    fitToScreen() {
      if (this.nodes.size === 0) {
        this.view = { x: 40, y: 40, zoom: 1 };
        this.applyViewTransform();
        return;
      }

      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      this.nodes.forEach(n => {
        if (n.x < minX) minX = n.x;
        if (n.y < minY) minY = n.y;
        if (n.x + 280 > maxX) maxX = n.x + 280;
        if (n.y + 200 > maxY) maxY = n.y + 200;
      });

      const vpRect = this.dom.viewport.getBoundingClientRect();
      const padding = 80;
      const graphWidth = maxX - minX;
      const graphHeight = maxY - minY;

      const scaleX = (vpRect.width - padding * 2) / graphWidth;
      const scaleY = (vpRect.height - padding * 2) / graphHeight;
      const zoom = Math.min(Math.max(Math.min(scaleX, scaleY), 0.4), 1.2);

      this.view.zoom = zoom;
      this.view.x = (vpRect.width - graphWidth * zoom) / 2 - minX * zoom;
      this.view.y = (vpRect.height - graphHeight * zoom) / 2 - minY * zoom;

      this.applyViewTransform();
      this.renderMinimap();
      if (this.dom.zoomText) {
        this.dom.zoomText.textContent = `${Math.round(this.view.zoom * 100)}%`;
      }
    }

    // ==========================================================================
    // NODE DRAGGING & EVENTS
    // ==========================================================================
    bindNodeEvents(nodeEl, nodeObj) {
      const header = nodeEl.querySelector('.node-header');
      const deleteBtn = nodeEl.querySelector('.btn-delete');

      // Click to select
      nodeEl.addEventListener('pointerdown', (e) => {
        if (!e.target.closest('.node-port') && !e.target.closest('.node-act-btn')) {
          this.selectNode(nodeObj.id);
        }
      });

      // Drag node by header
      header.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.node-act-btn')) return;
        this.activeDraggedNode = nodeObj;
        this.selectNode(nodeObj.id);

        const vpRect = this.dom.viewport.getBoundingClientRect();
        const worldMouseX = (e.clientX - vpRect.left - this.view.x) / this.view.zoom;
        const worldMouseY = (e.clientY - vpRect.top - this.view.y) / this.view.zoom;

        this.dragOffset = {
          x: worldMouseX - nodeObj.x,
          y: worldMouseY - nodeObj.y
        };
      });

      // Delete button
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteNode(nodeObj.id);
      });

      // Port Click / Drag to wire
      nodeEl.querySelectorAll('.node-port').forEach(port => {
        port.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          const portType = port.dataset.portType;
          const portName = port.dataset.portName;

          if (portType === 'output') {
            const portPos = this.getPortCoordinates(nodeObj.id, portType, portName);
            this.activeConnecting = {
              nodeId: nodeObj.id,
              portType,
              portName,
              startX: portPos.x,
              startY: portPos.y
            };
          }
        });
      });
    }

    // ==========================================================================
    // WIRES & CONNECTIONS (BEZIER CURVES)
    // ==========================================================================
    createConnection(fromNodeId, fromPort, toNodeId, toPort) {
      // Prevent duplicates
      const exists = this.connections.some(c => 
        c.fromNode === fromNodeId && c.fromPort === fromPort && c.toNode === toNodeId && c.toPort === toPort
      );
      if (exists) return;

      const connection = {
        id: `wire_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        fromNode: fromNodeId,
        fromPort,
        toNode: toNodeId,
        toPort
      };

      this.connections.push(connection);
      this.synth.playConnect();
      this.renderAllWires();
      this.updateStatusChip();
      this.saveToLocalStorage();
    }

    deleteConnection(connectionId) {
      this.connections = this.connections.filter(c => c.id !== connectionId);
      this.synth.playDisconnect();
      this.renderAllWires();
      this.updateStatusChip();
      this.saveToLocalStorage();
    }

    getPortCoordinates(nodeId, portType, portName) {
      const node = this.nodes.get(nodeId);
      if (!node || !node.domElement) return { x: 0, y: 0 };

      const el = node.domElement;
      const port = el.querySelector(`.node-port[data-port-type="${portType}"][data-port-name="${portName}"]`);
      if (!port) return { x: node.x, y: node.y };

      const width = el.offsetWidth || 270;
      let portY = el.offsetHeight / 2;

      if (portName === 'true') portY = el.offsetHeight * 0.35;
      if (portName === 'false') portY = el.offsetHeight * 0.70;

      return {
        x: portType === 'output' ? node.x + width : node.x,
        y: node.y + portY
      };
    }

    renderAllWires() {
      this.dom.wiresGroup.innerHTML = '';

      this.connections.forEach(conn => {
        const p1 = this.getPortCoordinates(conn.fromNode, 'output', conn.fromPort);
        const p2 = this.getPortCoordinates(conn.toNode, 'input', conn.toPort);

        const pathStr = this.calculateBezierPath(p1.x, p1.y, p2.x, p2.y);

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', 'wire-path');
        path.setAttribute('id', conn.id);
        path.setAttribute('d', pathStr);
        path.setAttribute('title', 'Click to disconnect wire');

        // Click wire to delete
        path.addEventListener('click', (e) => {
          e.stopPropagation();
          this.deleteConnection(conn.id);
        });

        this.dom.wiresGroup.appendChild(path);
      });
    }

    calculateBezierPath(x1, y1, x2, y2) {
      const dx = Math.max(Math.abs(x2 - x1) * 0.5, 40);
      return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
    }

    drawTempWire(x1, y1, x2, y2) {
      const pathStr = this.calculateBezierPath(x1, y1, x2, y2);
      this.dom.tempWire.setAttribute('d', pathStr);
    }

    // ==========================================================================
    // MINIMAP ENGINE
    // ==========================================================================
    renderMinimap() {
      const canvas = this.dom.minimapCanvas;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);

      if (this.nodes.size === 0) return;

      // Find bounds
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      this.nodes.forEach(n => {
        if (n.x < minX) minX = n.x;
        if (n.y < minY) minY = n.y;
        if (n.x + 280 > maxX) maxX = n.x + 280;
        if (n.y + 200 > maxY) maxY = n.y + 200;
      });

      // Add padding
      minX -= 150; minY -= 150; maxX += 150; maxY += 150;
      const scaleX = w / (maxX - minX);
      const scaleY = h / (maxY - minY);
      const scale = Math.min(scaleX, scaleY);

      // Draw Wires
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
      ctx.lineWidth = 1;
      this.connections.forEach(conn => {
        const p1 = this.getPortCoordinates(conn.fromNode, 'output', conn.fromPort);
        const p2 = this.getPortCoordinates(conn.toNode, 'input', conn.toPort);
        ctx.beginPath();
        ctx.moveTo((p1.x - minX) * scale, (p1.y - minY) * scale);
        ctx.lineTo((p2.x - minX) * scale, (p2.y - minY) * scale);
        ctx.stroke();
      });

      // Draw Nodes
      this.nodes.forEach(node => {
        const nx = (node.x - minX) * scale;
        const ny = (node.y - minY) * scale;
        const nw = 270 * scale;
        const nh = 160 * scale;

        ctx.fillStyle = node.id === this.selectedNodeId ? '#8b5cf6' : '#1e293b';
        ctx.fillRect(nx, ny, nw, nh);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.strokeRect(nx, ny, nw, nh);
      });

      // Viewport Rect on Minimap
      const vp = this.dom.viewport.getBoundingClientRect();
      const vLeft = (-this.view.x / this.view.zoom - minX) * scale;
      const vTop = (-this.view.y / this.view.zoom - minY) * scale;
      const vWidth = (vp.width / this.view.zoom) * scale;
      const vHeight = (vp.height / this.view.zoom) * scale;

      const ind = this.dom.minimapViewport;
      if (ind) {
        ind.style.left = `${Math.max(vLeft, 0)}px`;
        ind.style.top = `${Math.max(vTop, 0)}px`;
        ind.style.width = `${Math.min(vWidth, w)}px`;
        ind.style.height = `${Math.min(vHeight, h)}px`;
      }
    }

    // ==========================================================================
    // EXECUTION ENGINE SIMULATION & TELEMETRY
    // ==========================================================================
    async runWorkflow() {
      if (this.isExecuting) return;
      if (this.nodes.size === 0) {
        this.showToast('Canvas is empty. Add nodes to run workflow.', 'error');
        return;
      }

      this.isExecuting = true;
      this.dom.runBtn.classList.add('executing');
      this.dom.runText.textContent = 'Executing...';
      this.synth.init();

      // Reset Node Visuals
      this.nodes.forEach(n => {
        n.status = 'idle';
        n.domElement.classList.remove('executing', 'completed', 'has-error');
        const badge = n.domElement.querySelector('.status-label');
        if (badge) badge.textContent = 'QUEUED';
      });

      const startTime = performance.now();
      let accumulatedTokens = 0;
      let accumulatedCost = 0;
      this.appendLog('system', `▶ Pipeline execution started for ${this.nodes.size} nodes...`);

      // Determine Execution Order (Topological DAG simulation)
      const order = this.computeExecutionOrder();

      try {
        for (let i = 0; i < order.length; i++) {
          const nodeId = order[i];
          const node = this.nodes.get(nodeId);
          if (!node) continue;

          // Highlight node
          node.status = 'running';
          node.domElement.classList.add('executing');
          node.domElement.querySelector('.node-footer').className = 'node-footer status-running';
          node.domElement.querySelector('.status-label').textContent = 'RUNNING';

          this.synth.playStep();
          this.appendLog('running', `[Node ${i + 1}/${order.length}] Running "${node.title}" (${node.type})...`);

          // Animate outgoing particle to next nodes
          const outgoingWires = this.connections.filter(c => c.fromNode === nodeId);
          outgoingWires.forEach(wire => {
            const wireEl = document.getElementById(wire.id);
            if (wireEl) wireEl.classList.add('active');
            this.animateWirePacket(wire.id);
          });

          // Simulated Node Execution Latency & Output Generation
          const nodeLatency = 350 + Math.floor(Math.random() * 450);
          await new Promise(r => setTimeout(r, nodeLatency));

          // Generate Node Output Payload
          const nodeTokens = node.type === 'llm-agent' ? 300 + Math.floor(Math.random() * 500) : 40;
          accumulatedTokens += nodeTokens;
          accumulatedCost += (nodeTokens / 1000) * 0.002;

          node.metrics.latency = nodeLatency;
          node.metrics.tokens = nodeTokens;
          node.outputData = this.generateMockPayload(node);

          // Update Node Metrics Display
          const metricsSpan = node.domElement.querySelector('.node-metrics');
          if (metricsSpan) metricsSpan.textContent = `${nodeLatency}ms • ${nodeTokens}t`;

          node.status = 'completed';
          node.domElement.classList.remove('executing');
          node.domElement.classList.add('completed');
          node.domElement.querySelector('.node-footer').className = 'node-footer status-completed';
          node.domElement.querySelector('.status-label').textContent = 'SUCCESS';

          this.appendLog('success', `✔ [${node.title}] Finished in ${nodeLatency}ms. Generated ${nodeTokens} tokens.`);

          // Update Telemetry Panel
          const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
          this.updateTelemetryMetrics(elapsed, accumulatedTokens, accumulatedCost, i + 1);
        }

        const totalTime = ((performance.now() - startTime) / 1000).toFixed(2);
        this.synth.playSuccess();
        this.appendLog('highlight', `✅ Pipeline successfully finished in ${totalTime}s • ${accumulatedTokens} tokens consumed • Cost: $${accumulatedCost.toFixed(4)}`);
        this.showToast(`Workflow execution complete (${totalTime}s)!`, 'success');

      } catch (err) {
        this.appendLog('error', `❌ Execution halted: ${err.message}`);
        this.showToast('Workflow execution error', 'error');
      } finally {
        this.isExecuting = false;
        this.dom.runBtn.classList.remove('executing');
        this.dom.runText.textContent = 'Run Workflow';
        this.renderAllWires();
      }
    }

    computeExecutionOrder() {
      // Find nodes with 0 incoming connections first
      const incomingCount = new Map();
      this.nodes.forEach(n => incomingCount.set(n.id, 0));
      this.connections.forEach(c => {
        if (incomingCount.has(c.toNode)) {
          incomingCount.set(c.toNode, incomingCount.get(c.toNode) + 1);
        }
      });

      const queue = [];
      incomingCount.forEach((count, id) => {
        if (count === 0) queue.push(id);
      });

      const result = [];
      while (queue.length > 0) {
        const curr = queue.shift();
        result.push(curr);

        const outgoing = this.connections.filter(c => c.fromNode === curr);
        outgoing.forEach(c => {
          const nextId = c.toNode;
          const count = incomingCount.get(nextId) - 1;
          incomingCount.set(nextId, count);
          if (count === 0) queue.push(nextId);
        });
      }

      // If cyclic or isolated, fallback to all node ids
      if (result.length < this.nodes.size) {
        this.nodes.forEach((_, id) => {
          if (!result.includes(id)) result.push(id);
        });
      }

      return result;
    }

    animateWirePacket(wireId) {
      const wirePath = document.getElementById(wireId);
      if (!wirePath) return;

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', '4');
      circle.setAttribute('class', 'wire-particle');

      const animateMotion = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
      animateMotion.setAttribute('dur', '0.6s');
      animateMotion.setAttribute('repeatCount', '1');
      animateMotion.setAttribute('path', wirePath.getAttribute('d'));

      circle.appendChild(animateMotion);
      this.dom.wiresGroup.appendChild(circle);

      setTimeout(() => {
        if (circle.parentNode) circle.parentNode.removeChild(circle);
      }, 650);
    }

    generateMockPayload(node) {
      const timestamp = new Date().toISOString();
      switch (node.type) {
        case 'webhook-trigger':
          return {
            event: 'github.push',
            timestamp,
            sender: '0612divyansh',
            repository: 'aetherflow-studio',
            commit: '8b7f2a1',
            files_changed: ['src/core.py', 'config/auth.json']
          };
        case 'llm-agent':
          return {
            model: node.config.model,
            vulnerabilities_detected: true,
            cve_id: 'CVE-2026-4412',
            severity: 'CRITICAL',
            summary: 'Hardcoded secret detected in auth configuration. Recommended patch: migrate to AWS Secrets Manager.',
            patch_diff: '--- a/config/auth.json\n+++ b/config/auth.json\n- "api_key": "sk_live_981"\n+ "api_key_env": "PROD_AUTH_KEY"'
          };
        case 'condition-branch':
          return {
            evaluated_expression: node.config.expression,
            branch_result: true,
            active_path: 'true'
          };
        case 'github-action':
          return {
            status: '201 Created',
            pull_request_url: 'https://github.com/0612divyansh/aetherflow-studio/pull/4',
            title: 'fix(security): Automated remediation for CVE-2026-4412',
            assigned: '0612divyansh'
          };
        case 'slack-alert':
          return {
            channel: node.config.channel,
            status: 'Delivered',
            message_id: 'msg_81927394'
          };
        default:
          return {
            node_id: node.id,
            status: 'SUCCESS',
            timestamp,
            data: { result: 'Processed payload successfully', code: 200 }
          };
      }
    }

    updateTelemetryMetrics(elapsed, tokens, cost, activeStep) {
      if (this.dom.metricTime) this.dom.metricTime.textContent = `${elapsed} s`;
      if (this.dom.metricTokens) this.dom.metricTokens.textContent = tokens.toLocaleString();
      if (this.dom.metricBreakdown) this.dom.metricBreakdown.textContent = `${Math.round(tokens * 0.45)} prompt / ${Math.round(tokens * 0.55)} completion`;
      if (this.dom.metricCost) this.dom.metricCost.textContent = `$${cost.toFixed(4)}`;
      if (this.dom.metricActive) this.dom.metricActive.textContent = `${activeStep} / ${this.nodes.size}`;
    }

    appendLog(type, message) {
      const entry = document.createElement('div');
      entry.className = `log-entry log-${type}`;
      const now = new Date().toLocaleTimeString();
      entry.innerHTML = `<span class="log-time">[${now}]</span> <span class="log-msg">${message}</span>`;
      this.dom.logContainer.appendChild(entry);
      this.dom.logContainer.scrollTop = this.dom.logContainer.scrollHeight;

      // Update badge
      const count = this.dom.logContainer.querySelectorAll('.log-entry').length;
      if (this.dom.logCountBadge) this.dom.logCountBadge.textContent = count.toString();
    }

    // ==========================================================================
    // INSPECTOR & CODE GENERATION
    // ==========================================================================
    updateInspectorOptions() {
      const select = this.dom.inspectorSelect;
      if (!select) return;
      select.innerHTML = '<option value="">(Select a node to inspect payload)</option>';

      this.nodes.forEach(node => {
        const opt = document.createElement('option');
        opt.value = node.id;
        opt.textContent = `${node.icon} ${node.title} (${node.id})`;
        select.appendChild(opt);
      });
    }

    renderInspectorOutput(nodeId) {
      const node = this.nodes.get(nodeId);
      if (!node) {
        this.dom.inspectorViewer.textContent = '// Select a node above to inspect payload.';
        return;
      }

      const payload = node.outputData || {
        status: 'IDLE (Run workflow to populate execution payload)',
        type: node.type,
        config: node.config
      };

      this.dom.inspectorViewer.textContent = JSON.stringify(payload, null, 2);
    }

    generateCode(language) {
      const nodesArr = Array.from(this.nodes.values());

      if (language === 'python') {
        return `# ==========================================================================
# AETHERFLOW STUDIO — EXECUTABLE PIPELINE
# Generated for: ${this.workflowName}
# ==========================================================================

import asyncio
from typing import Dict, Any

class PipelineExecutor:
    def __init__(self):
        self.state: Dict[str, Any] = {}

    async def run(self, initial_payload: Dict[str, Any]):
        print(f"🚀 Starting pipeline: ${this.workflowName}")
        data = initial_payload

${nodesArr.map((n, i) => `        # Step ${i + 1}: ${n.title} (${n.type})
        data = await self.step_${n.id.replace(/-/g, '_')}(data)`).join('\n\n')}

        print("✅ Pipeline finished successfully.")
        return data

${nodesArr.map(n => `    async def step_${n.id.replace(/-/g, '_')}(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        # Config: ${JSON.stringify(n.config)}
        print(f"Executing: ${n.title}")
        await asyncio.sleep(0.3)
        return {"step": "${n.id}", "status": "COMPLETED", "input": payload}`).join('\n\n')}

if __name__ == "__main__":
    executor = PipelineExecutor()
    asyncio.run(executor.run({"source": "webhook", "event": "start"}))
`;
      } else if (language === 'typescript') {
        return `// ==========================================================================
// AETHERFLOW STUDIO — TYPESCRIPT ORCHESTRATOR
// Pipeline: ${this.workflowName}
// ==========================================================================

export interface WorkflowState {
  stepId: string;
  timestamp: string;
  payload: Record<string, any>;
}

export async function executeWorkflow(initialPayload: Record<string, any>) {
  console.log("▶ Executing ${this.workflowName}...");
  let current = initialPayload;

${nodesArr.map((n, i) => `  // Step ${i + 1}: ${n.title}
  current = await executeNode_${n.id.replace(/-/g, '_')}(current);`).join('\n')}

  console.log("✔ Completed workflow execution.");
  return current;
}

${nodesArr.map(n => `async function executeNode_${n.id.replace(/-/g, '_')}(data: Record<string, any>) {
  // Config: ${JSON.stringify(n.config)}
  return { ...data, lastNode: "${n.id}", status: "SUCCESS" };
}`).join('\n\n')}
`;
      } else {
        return JSON.stringify(this.serializeWorkflow(), null, 2);
      }
    }

    // ==========================================================================
    // UI BINDINGS & HANDLERS
    // ==========================================================================
    bindPaletteEvents() {
      const palette = document.getElementById('palette-items-container');
      const filter = document.getElementById('palette-filter');

      // Filter
      if (filter) {
        filter.addEventListener('input', (e) => {
          const q = e.target.value.toLowerCase();
          document.querySelectorAll('.palette-item').forEach(item => {
            const name = item.querySelector('.item-name').textContent.toLowerCase();
            const desc = item.querySelector('.item-desc').textContent.toLowerCase();
            const match = name.includes(q) || desc.includes(q);
            item.style.display = match ? 'flex' : 'none';
          });
        });
      }

      // Drag from palette
      document.querySelectorAll('.palette-item').forEach(item => {
        item.addEventListener('dragstart', (e) => {
          const type = item.dataset.nodeType;
          e.dataTransfer.setData('text/plain', type);
        });

        // Double click to spawn in viewport center
        item.addEventListener('dblclick', () => {
          const type = item.dataset.nodeType;
          this.spawnNodeInCenter(type);
        });
      });

      // Drop on viewport
      this.dom.viewport.addEventListener('dragover', (e) => e.preventDefault());
      this.dom.viewport.addEventListener('drop', (e) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('text/plain');
        if (!type || !NODE_TYPES[type]) return;

        const vpRect = this.dom.viewport.getBoundingClientRect();
        const worldX = (e.clientX - vpRect.left - this.view.x) / this.view.zoom;
        const worldY = (e.clientY - vpRect.top - this.view.y) / this.view.zoom;

        const node = this.createNode(type, worldX - 100, worldY - 40);
        if (node) {
          this.synth.playConnect();
          this.saveToLocalStorage();
          this.showToast(`Added ${node.title}`, 'info');
        }
      });
    }

    spawnNodeInCenter(type) {
      const vpRect = this.dom.viewport.getBoundingClientRect();
      const worldX = (vpRect.width / 2 - this.view.x) / this.view.zoom;
      const worldY = (vpRect.height / 2 - this.view.y) / this.view.zoom;
      const node = this.createNode(type, worldX - 100, worldY - 40);
      if (node) {
        this.synth.playConnect();
        this.saveToLocalStorage();
        this.showToast(`Added ${node.title}`, 'info');
      }
    }

    bindHeaderActions() {
      // Sound Toggle
      this.dom.soundToggleBtn.addEventListener('click', () => {
        const active = this.synth.toggle();
        this.updateSoundIcon();
        this.showToast(active ? 'Synthesizer Audio Enabled' : 'Audio Muted', 'info');
      });

      // Name Input
      this.dom.nameInput.addEventListener('input', (e) => {
        this.workflowName = e.target.value || 'Untitled Flow';
        this.saveToLocalStorage();
      });

      // Template Select
      this.dom.templateSelect.addEventListener('change', (e) => {
        this.loadTemplate(e.target.value);
      });

      // Clear Canvas
      document.getElementById('btn-clear-canvas').addEventListener('click', () => {
        if (confirm('Clear all nodes and wires from canvas?')) {
          this.nodes.forEach(n => {
            if (n.domElement && n.domElement.parentNode) n.domElement.parentNode.removeChild(n.domElement);
          });
          this.nodes.clear();
          this.connections = [];
          this.dom.wiresGroup.innerHTML = '';
          this.saveToLocalStorage();
          this.renderMinimap();
          this.updateStatusChip();
          this.showToast('Canvas cleared', 'info');
        }
      });

      // Run Workflow
      this.dom.runBtn.addEventListener('click', () => this.runWorkflow());

      // Canvas Zoom Buttons
      document.getElementById('btn-zoom-in').addEventListener('click', () => this.setZoom(this.view.zoom * 1.2));
      document.getElementById('btn-zoom-out').addEventListener('click', () => this.setZoom(this.view.zoom * 0.8));
      document.getElementById('btn-zoom-reset').addEventListener('click', () => this.setZoom(1));
      document.getElementById('btn-fit-screen').addEventListener('click', () => this.fitToScreen());
    }

    bindDockEvents() {
      // Tab switching
      document.querySelectorAll('.dock-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          document.querySelectorAll('.dock-tab').forEach(t => t.classList.remove('active'));
          document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

          tab.classList.add('active');
          const panelId = `panel-${tab.dataset.tab}`;
          const panel = document.getElementById(panelId);
          if (panel) panel.classList.add('active');
        });
      });

      // Toggle Dock Minimized
      document.getElementById('btn-toggle-dock').addEventListener('click', () => {
        this.dom.telemetryDock.classList.toggle('minimized');
      });

      // Clear Logs
      document.getElementById('btn-clear-logs').addEventListener('click', () => {
        this.dom.logContainer.innerHTML = '';
        if (this.dom.logCountBadge) this.dom.logCountBadge.textContent = '0';
      });

      // Inspector Select
      this.dom.inspectorSelect.addEventListener('change', (e) => {
        this.renderInspectorOutput(e.target.value);
      });
    }

    bindModals() {
      // Command Palette (Cmd+K)
      document.getElementById('btn-cmd-palette').addEventListener('click', () => this.openCommandPalette());
      document.getElementById('btn-close-cmd').addEventListener('click', () => this.dom.cmdDialog.close());

      // Code Generator Modal
      document.getElementById('btn-open-code-modal').addEventListener('click', () => {
        this.openCodeModal('python');
      });
      document.getElementById('btn-close-code').addEventListener('click', () => this.dom.codeDialog.close());

      document.querySelectorAll('.code-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          document.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const lang = tab.dataset.lang;
          this.dom.codeDisplay.textContent = this.generateCode(lang);
        });
      });

      document.getElementById('btn-copy-code').addEventListener('click', () => {
        const text = this.dom.codeDisplay.textContent;
        navigator.clipboard.writeText(text).then(() => {
          const btnText = document.getElementById('copy-btn-text');
          btnText.textContent = '✔ Copied to Clipboard!';
          setTimeout(() => btnText.textContent = '📋 Copy Code', 2000);
          this.showToast('Code copied to clipboard!', 'success');
        });
      });

      // Project File Actions Modal
      document.getElementById('btn-open-file-actions').addEventListener('click', () => {
        this.dom.projectDialog.showModal();
      });
      document.getElementById('btn-close-project').addEventListener('click', () => {
        this.dom.projectDialog.close();
      });

      // Download JSON
      document.getElementById('btn-trigger-json-download').addEventListener('click', () => {
        const data = this.serializeWorkflow();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.workflowName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.aether.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Project JSON exported!', 'success');
      });

      // Import JSON
      const fileInput = document.getElementById('file-input-json');
      document.getElementById('btn-trigger-json-upload').addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const data = JSON.parse(evt.target.result);
            this.loadWorkflowData(data);
            this.saveToLocalStorage();
            this.dom.projectDialog.close();
            this.showToast('Project imported successfully!', 'success');
          } catch (err) {
            alert('Invalid AetherFlow JSON file: ' + err.message);
          }
        };
        reader.readAsText(file);
      });

      // Export PNG Canvas Snapshot
      document.getElementById('btn-trigger-png-export').addEventListener('click', () => {
        this.exportCanvasPNG();
      });
    }

    openCodeModal(initialLang = 'python') {
      this.dom.codeDisplay.textContent = this.generateCode(initialLang);
      this.dom.codeDialog.showModal();
    }

    openCommandPalette() {
      const dialog = this.dom.cmdDialog;
      const input = this.dom.cmdInput;
      const list = this.dom.cmdResults;

      input.value = '';
      this.renderCommandList('');
      dialog.showModal();
      input.focus();

      input.oninput = () => {
        this.renderCommandList(input.value.toLowerCase());
      };
    }

    renderCommandList(query) {
      const list = this.dom.cmdResults;
      list.innerHTML = '';

      const actions = [
        { title: 'Run Workflow', cat: 'Action', shortcut: 'Space', action: () => this.runWorkflow() },
        { title: 'Export Python Code', cat: 'Code Gen', shortcut: 'Cmd+E', action: () => this.openCodeModal('python') },
        { title: 'Export TypeScript Code', cat: 'Code Gen', shortcut: '', action: () => this.openCodeModal('typescript') },
        { title: 'Fit All Nodes on Screen', cat: 'View', shortcut: 'F', action: () => this.fitToScreen() },
        { title: 'Template: SecOps Auditor', cat: 'Template', shortcut: '', action: () => this.loadTemplate('secops') },
        { title: 'Template: Growth & Lead Gen', cat: 'Template', shortcut: '', action: () => this.loadTemplate('lead-gen') },
        { title: 'Template: Research Synthesizer', cat: 'Template', shortcut: '', action: () => this.loadTemplate('research') },
        { title: 'Clear Canvas', cat: 'Action', shortcut: '', action: () => document.getElementById('btn-clear-canvas').click() }
      ];

      // Add all node types to commands
      Object.entries(NODE_TYPES).forEach(([type, meta]) => {
        actions.push({
          title: `Add ${meta.title}`,
          cat: `Node (${meta.category})`,
          shortcut: '',
          action: () => this.spawnNodeInCenter(type)
        });
      });

      const filtered = actions.filter(a => a.title.toLowerCase().includes(query) || a.cat.toLowerCase().includes(query));

      filtered.forEach((item, idx) => {
        const el = document.createElement('div');
        el.className = `cmd-item ${idx === 0 ? 'active' : ''}`;
        el.innerHTML = `
          <div class="cmd-item-left">
            <span class="cmd-item-title">${item.title}</span>
            <span class="cmd-item-cat">${item.cat}</span>
          </div>
          ${item.shortcut ? `<span class="cmd-item-shortcut">${item.shortcut}</span>` : ''}
        `;
        el.addEventListener('click', () => {
          this.dom.cmdDialog.close();
          item.action();
        });
        list.appendChild(el);
      });
    }

    exportCanvasPNG() {
      const canvas = document.createElement('canvas');
      canvas.width = 1600;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');

      // Gradient background
      const grad = ctx.createRadialGradient(800, 500, 50, 800, 500, 900);
      grad.addColorStop(0, '#131b2e');
      grad.addColorStop(1, '#07090e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid dots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      for (let x = 0; x < canvas.width; x += 30) {
        for (let y = 0; y < canvas.height; y += 30) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Title & Watermark
      ctx.font = 'bold 28px Outfit, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(this.workflowName, 50, 60);

      ctx.font = '14px Inter, sans-serif';
      ctx.fillStyle = '#06b6d4';
      ctx.fillText('AetherFlow Studio • github.com/0612divyansh/aetherflow-studio', 50, 90);

      // Render simplified nodes onto image
      this.nodes.forEach(n => {
        const nx = Math.max(50, Math.min(n.x, 1250));
        const ny = Math.max(120, Math.min(n.y, 750));

        // Node card
        ctx.fillStyle = '#111726';
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(nx, ny, 260, 140, 10);
        ctx.fill();
        ctx.stroke();

        // Node Header
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.beginPath();
        ctx.roundRect(nx, ny, 260, 36, [10, 10, 0, 0]);
        ctx.fill();

        ctx.font = 'bold 14px Outfit, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${n.icon} ${n.title}`, nx + 12, ny + 24);

        // Node details
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillStyle = '#94a3b8';
        const keys = Object.keys(n.config).slice(0, 3);
        keys.forEach((k, idx) => {
          ctx.fillText(`${k}: ${n.config[k]}`, nx + 12, ny + 60 + idx * 20);
        });
      });

      // Export file
      const link = document.createElement('a');
      link.download = `${this.workflowName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-canvas.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      this.showToast('PNG snapshot exported!', 'success');
    }

    bindKeyboardShortcuts() {
      window.addEventListener('keydown', (e) => {
        // Cmd+K / Ctrl+K
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          this.openCommandPalette();
          return;
        }

        // Delete / Backspace node
        if ((e.key === 'Delete' || e.key === 'Backspace') && this.selectedNodeId) {
          // If not focusing an input or textarea
          if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
            e.preventDefault();
            this.deleteNode(this.selectedNodeId);
          }
        }

        // Space to Run (when not typing)
        if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
          e.preventDefault();
          this.runWorkflow();
        }
      });
    }

    updateSoundIcon() {
      if (this.dom.soundIndicator) {
        this.dom.soundIndicator.textContent = this.synth.enabled ? '🔊' : '🔇';
      }
    }

    updateStatusChip() {
      if (this.dom.statusChip) {
        this.dom.statusChip.textContent = `${this.nodes.size} Nodes • ${this.connections.length} Connections`;
      }
    }

    showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      const icon = type === 'success' ? '✔' : type === 'error' ? '✖' : 'ℹ';
      toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
      this.dom.toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px) scale(0.95)';
        setTimeout(() => {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 250);
      }, 3000);
    }
  }

  // Initialize on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    window.aetherflowApp = new AetherFlowApp();
  });

})();
