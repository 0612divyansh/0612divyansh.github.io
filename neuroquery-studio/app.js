/**
 * ============================================================================
 * NEUROQUERY STUDIO — CORE APPLICATION ENGINE (v1.0 • Launchpad Cycle #4)
 * Client-Side In-Memory Relational SQL Engine, Natural Language Synthesizer,
 * Dynamic Interactive Canvas ERD Visualizer & Dynamic Charting Engine
 *
 * Developer: Divyansh Shandil (0612divyansh)
 * ============================================================================
 */

(function () {
  'use strict';

  // ============================================================================
  // 1. TACTILE WEB AUDIO API SYNTHESIZER
  // ============================================================================
  class AudioSynth {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.initialized = false;
    }

    init() {
      if (this.initialized) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
          this.initialized = true;
        }
      } catch (e) {
        console.warn('Web Audio not supported', e);
      }
    }

    ensureContext() {
      if (!this.initialized) this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playClick() {
      if (this.muted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    }

    playWhoosh() {
      if (this.muted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.14);
    }

    playSuccess() {
      if (this.muted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + idx * 0.05;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.09, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.18);
      });
    }

    playError() {
      if (this.muted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    }
  }

  const audio = new AudioSynth();

  // ============================================================================
  // 2. RELATIONAL SCHEMAS & REALISTIC SEED DATA
  // ============================================================================
  const DATABASES = {
    saas_analytics: {
      name: 'SaaS Multi-Tenant Analytics',
      dialect: 'PostgreSQL 16',
      tables: {
        organizations: {
          columns: [
            { name: 'org_id', type: 'INT', isPk: true, isFk: false },
            { name: 'name', type: 'VARCHAR(100)', isPk: false, isFk: false },
            { name: 'tier', type: 'VARCHAR(50)', isPk: false, isFk: false },
            { name: 'created_at', type: 'DATE', isPk: false, isFk: false },
            { name: 'mrr', type: 'DECIMAL(10,2)', isPk: false, isFk: false },
            { name: 'status', type: 'VARCHAR(20)', isPk: false, isFk: false }
          ],
          rows: [
            { org_id: 1, name: 'Vortex Dynamics', tier: 'Enterprise', created_at: '2025-02-14', mrr: 4500.00, status: 'active' },
            { org_id: 2, name: 'Nova Labs', tier: 'Pro', created_at: '2025-05-19', mrr: 1200.00, status: 'active' },
            { org_id: 3, name: 'Apex AI Systems', tier: 'Enterprise', created_at: '2025-01-10', mrr: 8900.00, status: 'active' },
            { org_id: 4, name: 'ByteSync Corp', tier: 'Starter', created_at: '2025-08-22', mrr: 290.00, status: 'trial' },
            { org_id: 5, name: 'Luminary Studios', tier: 'Pro', created_at: '2025-03-30', mrr: 1450.00, status: 'active' },
            { org_id: 6, name: 'HyperFlow Media', tier: 'Enterprise', created_at: '2025-06-11', mrr: 6200.00, status: 'active' },
            { org_id: 7, name: 'Krypton Security', tier: 'Pro', created_at: '2025-07-04', mrr: 1800.00, status: 'churned' },
            { org_id: 8, name: 'PulseMetrics Global', tier: 'Enterprise', created_at: '2025-04-18', mrr: 9500.00, status: 'active' }
          ]
        },
        users: {
          columns: [
            { name: 'user_id', type: 'INT', isPk: true, isFk: false },
            { name: 'org_id', type: 'INT', isPk: false, isFk: true, fkRef: { table: 'organizations', col: 'org_id' } },
            { name: 'email', type: 'VARCHAR(120)', isPk: false, isFk: false },
            { name: 'role', type: 'VARCHAR(40)', isPk: false, isFk: false },
            { name: 'last_login', type: 'DATE', isPk: false, isFk: false },
            { name: 'is_active', type: 'BOOLEAN', isPk: false, isFk: false }
          ],
          rows: [
            { user_id: 101, org_id: 1, email: 'alice@vortex.io', role: 'admin', last_login: '2026-11-24', is_active: true },
            { user_id: 102, org_id: 1, email: 'bob@vortex.io', role: 'developer', last_login: '2026-11-23', is_active: true },
            { user_id: 103, org_id: 2, email: 'carol@novalabs.tech', role: 'admin', last_login: '2026-11-25', is_active: true },
            { user_id: 104, org_id: 3, email: 'dan@apex-ai.com', role: 'owner', last_login: '2026-11-25', is_active: true },
            { user_id: 105, org_id: 3, email: 'elena@apex-ai.com', role: 'developer', last_login: '2026-11-22', is_active: true },
            { user_id: 106, org_id: 4, email: 'frank@bytesync.co', role: 'owner', last_login: '2026-11-15', is_active: false },
            { user_id: 107, org_id: 5, email: 'grace@luminary.design', role: 'admin', last_login: '2026-11-24', is_active: true },
            { user_id: 108, org_id: 6, email: 'hank@hyperflow.net', role: 'analyst', last_login: '2026-11-21', is_active: true },
            { user_id: 109, org_id: 7, email: 'iris@krypton.io', role: 'owner', last_login: '2026-10-18', is_active: false },
            { user_id: 110, org_id: 8, email: 'divyansh@pulsemetrics.io', role: 'owner', last_login: '2026-11-25', is_active: true }
          ]
        },
        subscriptions: {
          columns: [
            { name: 'sub_id', type: 'INT', isPk: true, isFk: false },
            { name: 'org_id', type: 'INT', isPk: false, isFk: true, fkRef: { table: 'organizations', col: 'org_id' } },
            { name: 'plan', type: 'VARCHAR(40)', isPk: false, isFk: false },
            { name: 'seats', type: 'INT', isPk: false, isFk: false },
            { name: 'monthly_amount', type: 'DECIMAL(10,2)', isPk: false, isFk: false },
            { name: 'renews_on', type: 'DATE', isPk: false, isFk: false },
            { name: 'status', type: 'VARCHAR(20)', isPk: false, isFk: false }
          ],
          rows: [
            { sub_id: 501, org_id: 1, plan: 'Enterprise Unlimited', seats: 120, monthly_amount: 4500.00, renews_on: '2026-12-14', status: 'active' },
            { sub_id: 502, org_id: 2, plan: 'Pro Team', seats: 25, monthly_amount: 1200.00, renews_on: '2026-12-19', status: 'active' },
            { sub_id: 503, org_id: 3, plan: 'Enterprise Dedicated', seats: 250, monthly_amount: 8900.00, renews_on: '2026-12-10', status: 'active' },
            { sub_id: 504, org_id: 4, plan: 'Starter Solo', seats: 5, monthly_amount: 290.00, renews_on: '2026-11-30', status: 'trial' },
            { sub_id: 505, org_id: 5, plan: 'Pro Team', seats: 30, monthly_amount: 1450.00, renews_on: '2026-12-30', status: 'active' },
            { sub_id: 506, org_id: 6, plan: 'Enterprise Unlimited', seats: 160, monthly_amount: 6200.00, renews_on: '2026-12-11', status: 'active' },
            { sub_id: 507, org_id: 7, plan: 'Pro Team', seats: 35, monthly_amount: 1800.00, renews_on: '2026-10-31', status: 'cancelled' },
            { sub_id: 508, org_id: 8, plan: 'Enterprise Cluster', seats: 300, monthly_amount: 9500.00, renews_on: '2026-12-18', status: 'active' }
          ]
        },
        invoices: {
          columns: [
            { name: 'invoice_id', type: 'INT', isPk: true, isFk: false },
            { name: 'org_id', type: 'INT', isPk: false, isFk: true, fkRef: { table: 'organizations', col: 'org_id' } },
            { name: 'amount', type: 'DECIMAL(10,2)', isPk: false, isFk: false },
            { name: 'status', type: 'VARCHAR(20)', isPk: false, isFk: false },
            { name: 'paid_at', type: 'DATE', isPk: false, isFk: false },
            { name: 'currency', type: 'VARCHAR(10)', isPk: false, isFk: false }
          ],
          rows: [
            { invoice_id: 9001, org_id: 1, amount: 4500.00, status: 'paid', paid_at: '2026-11-14', currency: 'USD' },
            { invoice_id: 9002, org_id: 2, amount: 1200.00, status: 'paid', paid_at: '2026-11-19', currency: 'USD' },
            { invoice_id: 9003, org_id: 3, amount: 8900.00, status: 'paid', paid_at: '2026-11-10', currency: 'USD' },
            { invoice_id: 9004, org_id: 4, amount: 290.00, status: 'unpaid', paid_at: null, currency: 'USD' },
            { invoice_id: 9005, org_id: 5, amount: 1450.00, status: 'paid', paid_at: '2026-10-30', currency: 'USD' },
            { invoice_id: 9006, org_id: 6, amount: 6200.00, status: 'paid', paid_at: '2026-11-11', currency: 'USD' },
            { invoice_id: 9007, org_id: 8, amount: 9500.00, status: 'paid', paid_at: '2026-11-18', currency: 'USD' }
          ]
        },
        features_usage: {
          columns: [
            { name: 'usage_id', type: 'INT', isPk: true, isFk: false },
            { name: 'org_id', type: 'INT', isPk: false, isFk: true, fkRef: { table: 'organizations', col: 'org_id' } },
            { name: 'feature_key', type: 'VARCHAR(60)', isPk: false, isFk: false },
            { name: 'calls_count', type: 'INT', isPk: false, isFk: false },
            { name: 'latency_p95_ms', type: 'DECIMAL(6,2)', isPk: false, isFk: false }
          ],
          rows: [
            { usage_id: 1, org_id: 1, feature_key: 'ai_copilot_inference', calls_count: 84000, latency_p95_ms: 124.5 },
            { usage_id: 2, org_id: 1, feature_key: 'realtime_websocket_sync', calls_count: 512000, latency_p95_ms: 18.2 },
            { usage_id: 3, org_id: 2, feature_key: 'pdf_export_pipeline', calls_count: 3200, latency_p95_ms: 450.0 },
            { usage_id: 4, org_id: 3, feature_key: 'ai_copilot_inference', calls_count: 320000, latency_p95_ms: 112.0 },
            { usage_id: 5, org_id: 3, feature_key: 'vector_search_rag', calls_count: 145000, latency_p95_ms: 48.6 },
            { usage_id: 6, org_id: 6, feature_key: 'realtime_websocket_sync', calls_count: 890000, latency_p95_ms: 15.4 },
            { usage_id: 7, org_id: 8, feature_key: 'ai_copilot_inference', calls_count: 420000, latency_p95_ms: 98.0 },
            { usage_id: 8, org_id: 8, feature_key: 'vector_search_rag', calls_count: 280000, latency_p95_ms: 42.1 }
          ]
        }
      },
      prompts: [
        { label: 'Top Organizations by MRR', query: 'Show me top 5 organizations ordered by MRR descending' },
        { label: 'Enterprise Subscriptions', query: 'List all active Enterprise subscriptions with their seats and monthly amount' },
        { label: 'Active Admins', query: 'Find all active users with role admin and their last login date' },
        { label: 'Unpaid Invoices', query: 'Show all unpaid invoices with organization ID and amount' },
        { label: 'AI Feature Usage', query: 'Find all features usage for ai_copilot_inference sorted by calls count' }
      ]
    },

    fintech_ledger: {
      name: 'FinTech Transaction Ledger',
      dialect: 'PostgreSQL 16',
      tables: {
        accounts: {
          columns: [
            { name: 'account_id', type: 'INT', isPk: true, isFk: false },
            { name: 'account_number', type: 'VARCHAR(30)', isPk: false, isFk: false },
            { name: 'holder_name', type: 'VARCHAR(80)', isPk: false, isFk: false },
            { name: 'tier', type: 'VARCHAR(30)', isPk: false, isFk: false },
            { name: 'balance', type: 'DECIMAL(12,2)', isPk: false, isFk: false },
            { name: 'currency', type: 'VARCHAR(5)', isPk: false, isFk: false }
          ],
          rows: [
            { account_id: 1001, account_number: 'ACC-883192', holder_name: 'Aarav Patel', tier: 'Platinum', balance: 48500.50, currency: 'INR' },
            { account_id: 1002, account_number: 'ACC-912384', holder_name: 'Sneha Rao', tier: 'Gold', balance: 14200.00, currency: 'INR' },
            { account_id: 1003, account_number: 'ACC-341902', holder_name: 'Vikram Malhotra', tier: 'Titanium', balance: 185000.75, currency: 'INR' },
            { account_id: 1004, account_number: 'ACC-552190', holder_name: 'Priya Sharma', tier: 'Silver', balance: 5200.20, currency: 'INR' },
            { account_id: 1005, account_number: 'ACC-774912', holder_name: 'Rohan Mehra', tier: 'Platinum', balance: 64000.00, currency: 'INR' },
            { account_id: 1006, account_number: 'ACC-119283', holder_name: 'Divyansh Shandil', tier: 'Titanium', balance: 320000.00, currency: 'INR' }
          ]
        },
        merchants: {
          columns: [
            { name: 'merchant_id', type: 'INT', isPk: true, isFk: false },
            { name: 'merchant_name', type: 'VARCHAR(80)', isPk: false, isFk: false },
            { name: 'category', type: 'VARCHAR(50)', isPk: false, isFk: false },
            { name: 'risk_score', type: 'DECIMAL(4,2)', isPk: false, isFk: false },
            { name: 'commission_rate', type: 'DECIMAL(4,3)', isPk: false, isFk: false }
          ],
          rows: [
            { merchant_id: 201, merchant_name: 'Swiggy Food Logistics', category: 'Food & Dining', risk_score: 0.12, commission_rate: 0.018 },
            { merchant_id: 202, merchant_name: 'Groww Mutual Funds', category: 'Investments', risk_score: 0.05, commission_rate: 0.005 },
            { merchant_id: 203, merchant_name: 'Razorpay Direct API', category: 'Payment Gateway', risk_score: 0.02, commission_rate: 0.015 },
            { merchant_id: 204, merchant_name: 'Flipkart Electronics', category: 'E-Commerce', risk_score: 0.22, commission_rate: 0.022 },
            { merchant_id: 205, merchant_name: 'Croma Retail', category: 'Electronics', risk_score: 0.15, commission_rate: 0.020 }
          ]
        },
        transactions: {
          columns: [
            { name: 'txn_id', type: 'INT', isPk: true, isFk: false },
            { name: 'account_id', type: 'INT', isPk: false, isFk: true, fkRef: { table: 'accounts', col: 'account_id' } },
            { name: 'merchant_id', type: 'INT', isPk: false, isFk: true, fkRef: { table: 'merchants', col: 'merchant_id' } },
            { name: 'amount', type: 'DECIMAL(10,2)', isPk: false, isFk: false },
            { name: 'txn_type', type: 'VARCHAR(20)', isPk: false, isFk: false },
            { name: 'status', type: 'VARCHAR(20)', isPk: false, isFk: false },
            { name: 'created_at', type: 'DATE', isPk: false, isFk: false }
          ],
          rows: [
            { txn_id: 8801, account_id: 1001, merchant_id: 201, amount: 650.00, txn_type: 'UPI', status: 'COMPLETED', created_at: '2026-11-25' },
            { txn_id: 8802, account_id: 1001, merchant_id: 202, amount: 15000.00, txn_type: 'NET_BANKING', status: 'COMPLETED', created_at: '2026-11-24' },
            { txn_id: 8803, account_id: 1003, merchant_id: 203, amount: 55000.00, txn_type: 'API_DIRECT', status: 'COMPLETED', created_at: '2026-11-25' },
            { txn_id: 8804, account_id: 1004, merchant_id: 204, amount: 89000.00, txn_type: 'CREDIT_CARD', status: 'FLAGGED', created_at: '2026-11-25' },
            { txn_id: 8805, account_id: 1002, merchant_id: 201, amount: 420.00, txn_type: 'UPI', status: 'COMPLETED', created_at: '2026-11-23' },
            { txn_id: 8806, account_id: 1005, merchant_id: 205, amount: 48000.00, txn_type: 'DEBIT_CARD', status: 'COMPLETED', created_at: '2026-11-24' },
            { txn_id: 8807, account_id: 1006, merchant_id: 202, amount: 120000.00, txn_type: 'IMPS', status: 'COMPLETED', created_at: '2026-11-25' }
          ]
        },
        settlements: {
          columns: [
            { name: 'settlement_id', type: 'INT', isPk: true, isFk: false },
            { name: 'merchant_id', type: 'INT', isPk: false, isFk: true, fkRef: { table: 'merchants', col: 'merchant_id' } },
            { name: 'net_amount', type: 'DECIMAL(12,2)', isPk: false, isFk: false },
            { name: 'fee_deducted', type: 'DECIMAL(10,2)', isPk: false, isFk: false },
            { name: 'settled_at', type: 'DATE', isPk: false, isFk: false }
          ],
          rows: [
            { settlement_id: 401, merchant_id: 201, net_amount: 1450000.00, fee_deducted: 26100.00, settled_at: '2026-11-24' },
            { settlement_id: 402, merchant_id: 202, net_amount: 8900000.00, fee_deducted: 44500.00, settled_at: '2026-11-24' },
            { settlement_id: 403, merchant_id: 203, net_amount: 5200000.00, fee_deducted: 78000.00, settled_at: '2026-11-25' },
            { settlement_id: 404, merchant_id: 204, net_amount: 3200000.00, fee_deducted: 70400.00, settled_at: '2026-11-25' }
          ]
        },
        fraud_alerts: {
          columns: [
            { name: 'alert_id', type: 'INT', isPk: true, isFk: false },
            { name: 'txn_id', type: 'INT', isPk: false, isFk: true, fkRef: { table: 'transactions', col: 'txn_id' } },
            { name: 'severity', type: 'VARCHAR(20)', isPk: false, isFk: false },
            { name: 'rule_triggered', type: 'VARCHAR(80)', isPk: false, isFk: false },
            { name: 'review_status', type: 'VARCHAR(30)', isPk: false, isFk: false }
          ],
          rows: [
            { alert_id: 701, txn_id: 8804, severity: 'HIGH', rule_triggered: 'VELOCITY_LIMIT_EXCEEDED', review_status: 'PENDING_MANUAL' }
          ]
        }
      },
      prompts: [
        { label: 'High Balance Accounts', query: 'Show all accounts with balance greater than 50000 ordered by balance descending' },
        { label: 'Flagged Transactions', query: 'Find all transactions with status FLAGGED and their amounts' },
        { label: 'Merchants by Risk Score', query: 'List merchants ordered by risk_score descending' },
        { label: 'UPI Transactions', query: 'Show all transactions where txn_type is UPI' },
        { label: 'Fraud Alerts', query: 'List all fraud alerts with high severity' }
      ]
    },

    ecommerce_global: {
      name: 'E-Commerce Global Logistics',
      dialect: 'PostgreSQL 16',
      tables: {
        customers: {
          columns: [
            { name: 'customer_id', type: 'INT', isPk: true, isFk: false },
            { name: 'full_name', type: 'VARCHAR(80)', isPk: false, isFk: false },
            { name: 'country', type: 'VARCHAR(40)', isPk: false, isFk: false },
            { name: 'tier', type: 'VARCHAR(30)', isPk: false, isFk: false },
            { name: 'total_spend', type: 'DECIMAL(10,2)', isPk: false, isFk: false }
          ],
          rows: [
            { customer_id: 1, full_name: 'Liam Chen', country: 'Singapore', tier: 'VIP Gold', total_spend: 3450.00 },
            { customer_id: 2, full_name: 'Sophia Mueller', country: 'Germany', tier: 'Standard', total_spend: 420.50 },
            { customer_id: 3, full_name: 'Arjun Das', country: 'India', tier: 'VIP Platinum', total_spend: 8900.00 },
            { customer_id: 4, full_name: 'Emily Watson', country: 'United States', tier: 'VIP Gold', total_spend: 2150.00 },
            { customer_id: 5, full_name: 'Mateo Rossi', country: 'Italy', tier: 'Standard', total_spend: 680.00 }
          ]
        },
        products: {
          columns: [
            { name: 'product_id', type: 'INT', isPk: true, isFk: false },
            { name: 'title', type: 'VARCHAR(100)', isPk: false, isFk: false },
            { name: 'category', type: 'VARCHAR(50)', isPk: false, isFk: false },
            { name: 'price', type: 'DECIMAL(10,2)', isPk: false, isFk: false },
            { name: 'stock_qty', type: 'INT', isPk: false, isFk: false },
            { name: 'rating', type: 'DECIMAL(3,2)', isPk: false, isFk: false }
          ],
          rows: [
            { product_id: 101, title: 'Spatial ANC Headphones', category: 'Audio', price: 299.99, stock_qty: 450, rating: 4.8 },
            { product_id: 102, title: 'Mechanical Ergonomic Keyboard', category: 'Peripherals', price: 189.50, stock_qty: 120, rating: 4.9 },
            { product_id: 103, title: 'Ultrawide 4K OLED Monitor', category: 'Displays', price: 899.00, stock_qty: 65, rating: 4.7 },
            { product_id: 104, title: 'USB-C Thunderbolt 4 Dock', category: 'Peripherals', price: 149.00, stock_qty: 320, rating: 4.6 },
            { product_id: 105, title: 'Smart Sensor Lightbar', category: 'Lighting', price: 79.99, stock_qty: 850, rating: 4.5 }
          ]
        },
        warehouses: {
          columns: [
            { name: 'warehouse_id', type: 'INT', isPk: true, isFk: false },
            { name: 'region', type: 'VARCHAR(50)', isPk: false, isFk: false },
            { name: 'capacity_sqft', type: 'INT', isPk: false, isFk: false },
            { name: 'utilization_pct', type: 'DECIMAL(5,2)', isPk: false, isFk: false }
          ],
          rows: [
            { warehouse_id: 1, region: 'Asia-Pacific (Singapore)', capacity_sqft: 250000, utilization_pct: 82.5 },
            { warehouse_id: 2, region: 'Europe (Frankfurt)', capacity_sqft: 400000, utilization_pct: 74.0 },
            { warehouse_id: 3, region: 'North America (Dallas)', capacity_sqft: 650000, utilization_pct: 89.2 }
          ]
        },
        orders: {
          columns: [
            { name: 'order_id', type: 'INT', isPk: true, isFk: false },
            { name: 'customer_id', type: 'INT', isPk: false, isFk: true, fkRef: { table: 'customers', col: 'customer_id' } },
            { name: 'total_amount', type: 'DECIMAL(10,2)', isPk: false, isFk: false },
            { name: 'order_status', type: 'VARCHAR(30)', isPk: false, isFk: false },
            { name: 'placed_at', type: 'DATE', isPk: false, isFk: false }
          ],
          rows: [
            { order_id: 5001, customer_id: 1, total_amount: 599.98, order_status: 'DELIVERED', placed_at: '2026-11-20' },
            { order_id: 5002, customer_id: 3, total_amount: 1088.50, order_status: 'SHIPPED', placed_at: '2026-11-24' },
            { order_id: 5003, customer_id: 4, total_amount: 299.99, order_status: 'PROCESSING', placed_at: '2026-11-25' },
            { order_id: 5004, customer_id: 3, total_amount: 899.00, order_status: 'DELIVERED', placed_at: '2026-11-15' }
          ]
        },
        order_items: {
          columns: [
            { name: 'item_id', type: 'INT', isPk: true, isFk: false },
            { name: 'order_id', type: 'INT', isPk: false, isFk: true, fkRef: { table: 'orders', col: 'order_id' } },
            { name: 'product_id', type: 'INT', isPk: false, isFk: true, fkRef: { table: 'products', col: 'product_id' } },
            { name: 'quantity', type: 'INT', isPk: false, isFk: false },
            { name: 'unit_price', type: 'DECIMAL(10,2)', isPk: false, isFk: false }
          ],
          rows: [
            { item_id: 1, order_id: 5001, product_id: 101, quantity: 2, unit_price: 299.99 },
            { item_id: 2, order_id: 5002, product_id: 102, quantity: 1, unit_price: 189.50 },
            { item_id: 3, order_id: 5002, product_id: 103, quantity: 1, unit_price: 899.00 },
            { item_id: 4, order_id: 5003, product_id: 101, quantity: 1, unit_price: 299.99 },
            { item_id: 5, order_id: 5004, product_id: 103, quantity: 1, unit_price: 899.00 }
          ]
        },
        shipments: {
          columns: [
            { name: 'shipment_id', type: 'INT', isPk: true, isFk: false },
            { name: 'order_id', type: 'INT', isPk: false, isFk: true, fkRef: { table: 'orders', col: 'order_id' } },
            { name: 'warehouse_id', type: 'INT', isPk: false, isFk: true, fkRef: { table: 'warehouses', col: 'warehouse_id' } },
            { name: 'carrier', type: 'VARCHAR(40)', isPk: false, isFk: false },
            { name: 'tracking_status', type: 'VARCHAR(30)', isPk: false, isFk: false },
            { name: 'delivery_days', type: 'INT', isPk: false, isFk: false }
          ],
          rows: [
            { shipment_id: 801, order_id: 5001, warehouse_id: 1, carrier: 'DHL Express', tracking_status: 'DELIVERED', delivery_days: 2 },
            { shipment_id: 802, order_id: 5002, warehouse_id: 2, carrier: 'FedEx Priority', tracking_status: 'IN_TRANSIT', delivery_days: 3 },
            { shipment_id: 803, order_id: 5003, warehouse_id: 3, carrier: 'UPS Ground', tracking_status: 'LABEL_CREATED', delivery_days: 4 },
            { shipment_id: 804, order_id: 5004, warehouse_id: 1, carrier: 'BlueDart Air', tracking_status: 'DELIVERED', delivery_days: 2 }
          ]
        }
      },
      prompts: [
        { label: 'Top Products by Rating', query: 'Show products with rating greater than 4.6 ordered by rating descending' },
        { label: 'VIP Customers', query: 'List all customers where tier LIKE VIP ordered by total_spend descending' },
        { label: 'High Stock Inventory', query: 'Find products with stock_qty greater than 200' },
        { label: 'Recent Orders', query: 'Show orders with total_amount greater than 500' },
        { label: 'Fast Shipments', query: 'Show shipments where delivery_days less than or equal to 3' }
      ]
    }
  };

  // State
  let currentDbKey = 'saas_analytics';
  let activeDb = JSON.parse(JSON.stringify(DATABASES[currentDbKey]));
  let currentQueryResult = null;
  let currentSort = { column: null, direction: 'asc' };
  let currentActiveTab = 'tab-sql-grid';

  // ============================================================================
  // 3. RELATIONAL SQL PARSER & EXECUTION ENGINE
  // ============================================================================
  class RelationalEngine {
    constructor(db) {
      this.db = db;
    }

    setDatabase(db) {
      this.db = db;
    }

    /**
     * Executes SQL string and returns { columns, rows, executionTimeMs, scannedRows, queryPlan }
     */
    execute(sqlStr) {
      const startTime = performance.now();
      const cleanSql = sqlStr.trim().replace(/;+$/, '');

      if (!cleanSql) {
        throw new Error('Empty SQL query string provided.');
      }

      // Basic regex parser for SELECT queries
      const selectMatch = cleanSql.match(/^SELECT\s+([\s\S]+?)\s+FROM\s+([a-zA-Z0-9_]+)([\s\S]*)$/i);
      if (!selectMatch) {
        throw new Error('Syntax Error: Only SELECT queries are supported in client-side preview engine.');
      }

      const rawColumns = selectMatch[1].trim();
      const primaryTable = selectMatch[2].trim().toLowerCase();
      const remainingClauses = selectMatch[3] || '';

      if (!this.db.tables[primaryTable]) {
        throw new Error(`Table not found: "${primaryTable}" in active database.`);
      }

      let sourceRows = JSON.parse(JSON.stringify(this.db.tables[primaryTable].rows));
      let scannedCount = sourceRows.length;
      let planSteps = [];

      planSteps.push({
        op: 'Seq Scan',
        detail: `Scan on public.${primaryTable}`,
        rows: sourceRows.length,
        cost: (sourceRows.length * 0.1).toFixed(1)
      });

      // 1. Check for JOIN
      const joinMatch = remainingClauses.match(/JOIN\s+([a-zA-Z0-9_]+)\s+ON\s+([a-zA-Z0-9_.]+)\s*=\s*([a-zA-Z0-9_.]+)/i);
      if (joinMatch) {
        const joinTable = joinMatch[1].trim().toLowerCase();
        const leftKey = joinMatch[2].trim();
        const rightKey = joinMatch[3].trim();

        if (!this.db.tables[joinTable]) {
          throw new Error(`Join target table not found: "${joinTable}".`);
        }

        const joinTargetRows = this.db.tables[joinTable].rows;
        scannedCount += joinTargetRows.length;

        // Perform inner hash join
        const joined = [];
        const leftColName = leftKey.includes('.') ? leftKey.split('.')[1] : leftKey;
        const rightColName = rightKey.includes('.') ? rightKey.split('.')[1] : rightKey;

        sourceRows.forEach(leftRow => {
          joinTargetRows.forEach(rightRow => {
            if (String(leftRow[leftColName]) === String(rightRow[rightColName])) {
              joined.push({ ...leftRow, ...rightRow });
            }
          });
        });

        sourceRows = joined;
        planSteps.push({
          op: 'Hash Join',
          detail: `Inner join on ${leftKey} = ${rightKey}`,
          rows: sourceRows.length,
          cost: (sourceRows.length * 0.25).toFixed(1)
        });
      }

      // 2. Check for WHERE clause
      const whereMatch = remainingClauses.match(/WHERE\s+([\s\S]+?)(?=(ORDER\s+BY|GROUP\s+BY|LIMIT|$))/i);
      if (whereMatch) {
        const whereCond = whereMatch[1].trim();
        sourceRows = sourceRows.filter(row => this.evaluateCondition(row, whereCond));
        planSteps.push({
          op: 'Filter',
          detail: `Condition: (${whereCond})`,
          rows: sourceRows.length,
          cost: (sourceRows.length * 0.15).toFixed(1)
        });
      }

      // 3. Check for ORDER BY clause
      const orderMatch = remainingClauses.match(/ORDER\s+BY\s+([a-zA-Z0-9_]+)(?:\s+(ASC|DESC))?/i);
      if (orderMatch) {
        const orderCol = orderMatch[1].trim();
        const orderDir = (orderMatch[2] || 'ASC').toUpperCase();

        sourceRows.sort((a, b) => {
          let va = a[orderCol];
          let vb = b[orderCol];
          if (va === undefined) return 0;
          if (!isNaN(Number(va)) && !isNaN(Number(vb))) {
            va = Number(va);
            vb = Number(vb);
          }
          if (va < vb) return orderDir === 'ASC' ? -1 : 1;
          if (va > vb) return orderDir === 'ASC' ? 1 : -1;
          return 0;
        });

        planSteps.push({
          op: 'Sort',
          detail: `Order by ${orderCol} ${orderDir}`,
          rows: sourceRows.length,
          cost: (sourceRows.length * 0.08).toFixed(1)
        });
      }

      // 4. Check for LIMIT clause
      const limitMatch = remainingClauses.match(/LIMIT\s+(\d+)/i);
      if (limitMatch) {
        const limitVal = parseInt(limitMatch[1], 10);
        sourceRows = sourceRows.slice(0, limitVal);
        planSteps.push({
          op: 'Limit',
          detail: `Row count: ${limitVal}`,
          rows: sourceRows.length,
          cost: '0.1'
        });
      }

      // 5. Column Projection & Aggregation
      let outputColumns = [];
      let outputRows = [];

      if (rawColumns === '*') {
        if (sourceRows.length > 0) {
          outputColumns = Object.keys(sourceRows[0]);
        } else {
          outputColumns = this.db.tables[primaryTable].columns.map(c => c.name);
        }
        outputRows = sourceRows;
      } else {
        const requestedCols = rawColumns.split(',').map(c => c.trim());

        // Check if there are aggregates like COUNT, SUM, AVG
        const hasAggregate = requestedCols.some(col => /^(COUNT|SUM|AVG|MIN|MAX)\(/i.test(col));

        if (hasAggregate) {
          const aggRow = {};
          requestedCols.forEach(colExpr => {
            const m = colExpr.match(/^(COUNT|SUM|AVG|MIN|MAX)\((.*?)\)(?:\s+AS\s+([a-zA-Z0-9_]+))?/i);
            if (m) {
              const func = m[1].toUpperCase();
              const targetCol = m[2].trim();
              const alias = m[3] ? m[3].trim() : `${func.toLowerCase()}_${targetCol.replace('*', 'total')}`;

              if (func === 'COUNT') {
                aggRow[alias] = sourceRows.length;
              } else if (func === 'SUM') {
                aggRow[alias] = sourceRows.reduce((acc, r) => acc + (Number(r[targetCol]) || 0), 0);
              } else if (func === 'AVG') {
                const total = sourceRows.reduce((acc, r) => acc + (Number(r[targetCol]) || 0), 0);
                aggRow[alias] = sourceRows.length ? Number((total / sourceRows.length).toFixed(2)) : 0;
              } else if (func === 'MIN') {
                aggRow[alias] = Math.min(...sourceRows.map(r => Number(r[targetCol]) || 0));
              } else if (func === 'MAX') {
                aggRow[alias] = Math.max(...sourceRows.map(r => Number(r[targetCol]) || 0));
              }
              outputColumns.push(alias);
            }
          });
          outputRows = [aggRow];
          planSteps.push({
            op: 'HashAggregate',
            detail: `Compute aggregates: ${requestedCols.join(', ')}`,
            rows: 1,
            cost: (sourceRows.length * 0.12).toFixed(1)
          });
        } else {
          outputColumns = requestedCols.map(c => {
            const aliasMatch = c.match(/(?:AS\s+)?([a-zA-Z0-9_]+)$/i);
            return aliasMatch ? aliasMatch[1] : c;
          });

          outputRows = sourceRows.map(row => {
            const newRow = {};
            requestedCols.forEach((colExpr, idx) => {
              const key = colExpr.split(/\s+AS\s+/i)[0].trim();
              const targetKey = outputColumns[idx];
              newRow[targetKey] = row[key] !== undefined ? row[key] : null;
            });
            return newRow;
          });
        }
      }

      const durationMs = Number((performance.now() - startTime).toFixed(2));

      return {
        columns: outputColumns,
        rows: outputRows,
        executionTimeMs: durationMs,
        scannedRows: scannedCount,
        queryPlan: planSteps
      };
    }

    evaluateCondition(row, cond) {
      // Handles: col = val, col > val, col < val, col >= val, col <= val, col LIKE val, col IS NULL
      cond = cond.trim();

      // Check IS NULL / IS NOT NULL
      if (/IS\s+NOT\s+NULL/i.test(cond)) {
        const col = cond.split(/IS\s+NOT\s+NULL/i)[0].trim();
        return row[col] !== null && row[col] !== undefined;
      }
      if (/IS\s+NULL/i.test(cond)) {
        const col = cond.split(/IS\s+NULL/i)[0].trim();
        return row[col] === null || row[col] === undefined;
      }

      // Check LIKE
      const likeMatch = cond.match(/([a-zA-Z0-9_]+)\s+LIKE\s+['"]?([^'"]+)['"]?/i);
      if (likeMatch) {
        const col = likeMatch[1].trim();
        const pattern = likeMatch[2].replace(/%/g, '.*');
        return new RegExp(pattern, 'i').test(String(row[col] || ''));
      }

      // Comparison operators
      const compMatch = cond.match(/([a-zA-Z0-9_]+)\s*(=|!=|>=|<=|>|<)\s*['"]?([^'"]+?)['"]?$/i);
      if (compMatch) {
        const col = compMatch[1].trim();
        const op = compMatch[2].trim();
        let val = compMatch[3].trim();

        let rowVal = row[col];
        if (!isNaN(Number(val)) && !isNaN(Number(rowVal))) {
          val = Number(val);
          rowVal = Number(rowVal);
        }

        switch (op) {
          case '=': return String(rowVal).toLowerCase() === String(val).toLowerCase();
          case '!=': return String(rowVal).toLowerCase() !== String(val).toLowerCase();
          case '>': return rowVal > val;
          case '<': return rowVal < val;
          case '>=': return rowVal >= val;
          case '<=': return rowVal <= val;
        }
      }

      return true;
    }
  }

  const engine = new RelationalEngine(activeDb);

  // ============================================================================
  // 4. NATURAL LANGUAGE TO SQL SYNTHESIZER
  // ============================================================================
  class NLSynthesizer {
    constructor(db) {
      this.db = db;
    }

    setDatabase(db) {
      this.db = db;
    }

    synthesize(prompt) {
      const p = prompt.toLowerCase().trim();

      // Check if prompt matches pre-mapped templates
      for (const t of this.db.prompts || []) {
        if (p.includes(t.label.toLowerCase()) || p.includes(t.query.toLowerCase())) {
          return this.synthesizeFromTemplate(t.query);
        }
      }

      // Dynamic rule matching
      // 1. "top N [entity] by [metric]"
      const topMatch = p.match(/top\s+(\d+)\s+([a-zA-Z0-9_]+)\s+by\s+([a-zA-Z0-9_]+)/i);
      if (topMatch) {
        const limit = topMatch[1];
        const rawEntity = topMatch[2];
        const rawMetric = topMatch[3];
        const tableName = this.resolveTableName(rawEntity);
        const colName = this.resolveColumnName(tableName, rawMetric);
        return `SELECT * FROM ${tableName} ORDER BY ${colName} DESC LIMIT ${limit};`;
      }

      // 2. "find/list all [entity] where/with [condition]"
      if (p.includes('active') && p.includes('user')) {
        return `SELECT user_id, email, role, last_login FROM users WHERE is_active = true ORDER BY last_login DESC;`;
      }

      if (p.includes('unpaid') && (p.includes('invoice') || p.includes('bill'))) {
        return `SELECT invoice_id, org_id, amount, status, currency FROM invoices WHERE status = 'unpaid';`;
      }

      if (p.includes('enterprise') && p.includes('sub')) {
        return `SELECT sub_id, org_id, plan, seats, monthly_amount, status FROM subscriptions WHERE plan LIKE '%Enterprise%' ORDER BY monthly_amount DESC;`;
      }

      if (p.includes('flagged') && p.includes('txn')) {
        return `SELECT txn_id, account_id, amount, txn_type, status FROM transactions WHERE status = 'FLAGGED';`;
      }

      if (p.includes('balance') && p.includes('account')) {
        return `SELECT account_id, holder_name, tier, balance FROM accounts WHERE balance > 50000 ORDER BY balance DESC;`;
      }

      if (p.includes('product') && p.includes('rating')) {
        return `SELECT product_id, title, category, price, rating FROM products WHERE rating >= 4.7 ORDER BY rating DESC;`;
      }

      if (p.includes('vip') && p.includes('customer')) {
        return `SELECT customer_id, full_name, country, tier, total_spend FROM customers WHERE tier LIKE '%VIP%' ORDER BY total_spend DESC;`;
      }

      // Fallback: Default SELECT * FROM first table LIMIT 15
      const firstTable = Object.keys(this.db.tables)[0];
      return `SELECT * FROM ${firstTable} LIMIT 15;`;
    }

    resolveTableName(word) {
      const tables = Object.keys(this.db.tables);
      for (const t of tables) {
        if (t.includes(word) || word.includes(t) || t.startsWith(word.slice(0, 4))) {
          return t;
        }
      }
      return tables[0];
    }

    resolveColumnName(table, word) {
      const cols = this.db.tables[table].columns;
      for (const c of cols) {
        if (c.name.toLowerCase().includes(word) || word.includes(c.name.toLowerCase())) {
          return c.name;
        }
      }
      return cols[0].name;
    }

    synthesizeFromTemplate(queryDesc) {
      const q = queryDesc.toLowerCase();
      const tables = Object.keys(this.db.tables);

      if (q.includes('organizations') && q.includes('mrr')) {
        return `SELECT org_id, name, tier, mrr, status FROM organizations ORDER BY mrr DESC LIMIT 5;`;
      }
      if (q.includes('enterprise') && q.includes('subscription')) {
        return `SELECT sub_id, org_id, plan, seats, monthly_amount, status FROM subscriptions WHERE status = 'active' ORDER BY monthly_amount DESC;`;
      }
      if (q.includes('admin')) {
        return `SELECT user_id, email, role, last_login FROM users WHERE role = 'admin' AND is_active = true;`;
      }
      if (q.includes('unpaid')) {
        return `SELECT invoice_id, org_id, amount, status FROM invoices WHERE status = 'unpaid';`;
      }
      if (q.includes('ai_copilot_inference')) {
        return `SELECT usage_id, org_id, feature_key, calls_count, latency_p95_ms FROM features_usage WHERE feature_key = 'ai_copilot_inference' ORDER BY calls_count DESC;`;
      }
      if (q.includes('accounts') && q.includes('balance')) {
        return `SELECT account_id, holder_name, tier, balance, currency FROM accounts WHERE balance > 50000 ORDER BY balance DESC;`;
      }
      if (q.includes('flagged')) {
        return `SELECT txn_id, account_id, amount, txn_type, status FROM transactions WHERE status = 'FLAGGED';`;
      }
      if (q.includes('merchants') && q.includes('risk')) {
        return `SELECT merchant_id, merchant_name, category, risk_score FROM merchants ORDER BY risk_score DESC;`;
      }
      if (q.includes('upi')) {
        return `SELECT txn_id, account_id, amount, status FROM transactions WHERE txn_type = 'UPI';`;
      }
      if (q.includes('fraud alerts')) {
        return `SELECT alert_id, txn_id, severity, rule_triggered, review_status FROM fraud_alerts WHERE severity = 'HIGH';`;
      }
      if (q.includes('rating')) {
        return `SELECT product_id, title, category, price, rating FROM products WHERE rating > 4.6 ORDER BY rating DESC;`;
      }
      if (q.includes('vip')) {
        return `SELECT customer_id, full_name, country, tier, total_spend FROM customers WHERE tier LIKE '%VIP%' ORDER BY total_spend DESC;`;
      }
      if (q.includes('stock')) {
        return `SELECT product_id, title, category, stock_qty FROM products WHERE stock_qty > 200 ORDER BY stock_qty DESC;`;
      }
      if (q.includes('orders') && q.includes('500')) {
        return `SELECT order_id, customer_id, total_amount, order_status FROM orders WHERE total_amount > 500 ORDER BY total_amount DESC;`;
      }
      if (q.includes('shipments')) {
        return `SELECT shipment_id, order_id, carrier, tracking_status, delivery_days FROM shipments WHERE delivery_days <= 3;`;
      }

      return `SELECT * FROM ${tables[0]} LIMIT 15;`;
    }
  }

  const synthesizer = new NLSynthesizer(activeDb);

  // ============================================================================
  // 5. INTERACTIVE DYNAMIC ERD CANVAS VISUALIZER
  // ============================================================================
  class ErdVisualizer {
    constructor(canvas, db) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.db = db;
      this.nodes = [];
      this.links = [];
      this.scale = 1.0;
      this.panX = 40;
      this.panY = 40;
      this.draggingNode = null;
      this.dragOffset = { x: 0, y: 0 };
      this.isPanning = false;
      this.lastMouse = { x: 0, y: 0 };
      this.hoveredCol = null;

      this.initNodes();
      this.setupEventListeners();
    }

    setDatabase(db) {
      this.db = db;
      this.initNodes();
      this.render();
    }

    initNodes() {
      this.nodes = [];
      this.links = [];
      const tables = Object.keys(this.db.tables);

      // Auto-layout in a responsive grid
      const colWidth = 240;
      const rowGap = 30;
      let curX = 50;
      let curY = 50;
      let maxHeightInCol = 0;

      tables.forEach((tblKey, idx) => {
        const tbl = this.db.tables[tblKey];
        const nodeHeight = 40 + tbl.columns.length * 22;

        this.nodes.push({
          id: tblKey,
          name: tblKey,
          x: curX,
          y: curY,
          width: colWidth,
          height: nodeHeight,
          columns: tbl.columns,
          rowCount: tbl.rows.length
        });

        curX += colWidth + 80;
        if (curX > 850) {
          curX = 50;
          curY += 260;
        }
      });

      // Extract Foreign Key Links
      tables.forEach(tblKey => {
        const tbl = this.db.tables[tblKey];
        tbl.columns.forEach(col => {
          if (col.isFk && col.fkRef) {
            this.links.push({
              sourceTable: tblKey,
              sourceCol: col.name,
              targetTable: col.fkRef.table,
              targetCol: col.fkRef.col
            });
          }
        });
      });
    }

    setupEventListeners() {
      const c = this.canvas;

      c.addEventListener('mousedown', (e) => {
        const rect = c.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left - this.panX) / this.scale;
        const mouseY = (e.clientY - rect.top - this.panY) / this.scale;

        // Check if clicked inside a node
        for (let i = this.nodes.length - 1; i >= 0; i--) {
          const node = this.nodes[i];
          if (
            mouseX >= node.x &&
            mouseX <= node.x + node.width &&
            mouseY >= node.y &&
            mouseY <= node.y + node.height
          ) {
            this.draggingNode = node;
            this.dragOffset.x = mouseX - node.x;
            this.dragOffset.y = mouseY - node.y;
            audio.playClick();
            this.showTableDetailDrawer(node);
            return;
          }
        }

        // Otherwise panning
        this.isPanning = true;
        this.lastMouse.x = e.clientX;
        this.lastMouse.y = e.clientY;
      });

      window.addEventListener('mousemove', (e) => {
        if (this.draggingNode) {
          const rect = c.getBoundingClientRect();
          const mouseX = (e.clientX - rect.left - this.panX) / this.scale;
          const mouseY = (e.clientY - rect.top - this.panY) / this.scale;

          this.draggingNode.x = mouseX - this.dragOffset.x;
          this.draggingNode.y = mouseY - this.dragOffset.y;
          this.render();
        } else if (this.isPanning) {
          const dx = e.clientX - this.lastMouse.x;
          const dy = e.clientY - this.lastMouse.y;
          this.panX += dx;
          this.panY += dy;
          this.lastMouse.x = e.clientX;
          this.lastMouse.y = e.clientY;
          this.render();
        }
      });

      window.addEventListener('mouseup', () => {
        this.draggingNode = null;
        this.isPanning = false;
      });

      c.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
        this.scale = Math.min(Math.max(this.scale * zoomFactor, 0.4), 2.2);
        this.render();
      }, { passive: false });
    }

    render() {
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Background subtle grid
      ctx.save();
      ctx.fillStyle = '#07090e';
      ctx.fillRect(0, 0, w, h);

      ctx.translate(this.panX, this.panY);
      ctx.scale(this.scale, this.scale);

      // Draw Grid Dots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      const gridSize = 30;
      for (let x = -1000; x < 2500; x += gridSize) {
        for (let y = -1000; y < 2500; y += gridSize) {
          ctx.fillRect(x, y, 1.5, 1.5);
        }
      }

      // Draw Relation Bezier Connectors
      this.links.forEach(link => {
        const srcNode = this.nodes.find(n => n.id === link.sourceTable);
        const tgtNode = this.nodes.find(n => n.id === link.targetTable);

        if (srcNode && tgtNode) {
          const srcIdx = srcNode.columns.findIndex(c => c.name === link.sourceCol);
          const tgtIdx = tgtNode.columns.findIndex(c => c.name === link.targetCol);

          const startX = srcNode.x + srcNode.width;
          const startY = srcNode.y + 40 + (srcIdx >= 0 ? srcIdx : 0) * 22 + 11;

          const endX = tgtNode.x;
          const endY = tgtNode.y + 40 + (tgtIdx >= 0 ? tgtIdx : 0) * 22 + 11;

          const cp1x = startX + 50;
          const cp1y = startY;
          const cp2x = endX - 50;
          const cp2y = endY;

          // Animated glow line
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
          ctx.strokeStyle = '#00e5ff';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Endpoint dots
          ctx.fillStyle = '#a855f7';
          ctx.beginPath();
          ctx.arc(startX, startY, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(endX, endY, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw Table Entity Cards
      this.nodes.forEach(node => {
        // Node Card Outer Glow & Shadow
        ctx.fillStyle = '#161b24';
        ctx.strokeStyle = '#323d52';
        ctx.lineWidth = 1.5;

        // Rounded Card
        this.roundRect(ctx, node.x, node.y, node.width, node.height, 8, true, true);

        // Header Background
        ctx.fillStyle = '#1f2937';
        this.roundRect(ctx, node.x, node.y, node.width, 36, { tl: 8, tr: 8, bl: 0, br: 0 }, true, false);

        // Header Border
        ctx.beginPath();
        ctx.moveTo(node.x, node.y + 36);
        ctx.lineTo(node.x + node.width, node.y + 36);
        ctx.strokeStyle = '#242c3d';
        ctx.stroke();

        // Header Title
        ctx.fillStyle = '#00e5ff';
        ctx.font = 'bold 13px "Fira Code", monospace';
        ctx.fillText(node.name, node.x + 12, node.y + 23);

        // Row count badge
        ctx.fillStyle = '#64748b';
        ctx.font = '10px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(`${node.rowCount} rows`, node.x + node.width - 50, node.y + 22);

        // Columns
        node.columns.forEach((col, idx) => {
          const colY = node.y + 40 + idx * 22;

          // Column divider
          ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
          ctx.fillRect(node.x + 2, colY, node.width - 4, 20);

          // PK or FK badges
          if (col.isPk) {
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(node.x + 10, colY + 5, 18, 12);
            ctx.fillStyle = '#000';
            ctx.font = 'bold 8px monospace';
            ctx.fillText('PK', node.x + 13, colY + 14);
          } else if (col.isFk) {
            ctx.fillStyle = '#a855f7';
            ctx.fillRect(node.x + 10, colY + 5, 18, 12);
            ctx.fillStyle = '#000';
            ctx.font = 'bold 8px monospace';
            ctx.fillText('FK', node.x + 13, colY + 14);
          } else {
            ctx.fillStyle = '#475569';
            ctx.beginPath();
            ctx.arc(node.x + 18, colY + 11, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Column name
          ctx.fillStyle = '#e2e8f0';
          ctx.font = '11px "Fira Code", monospace';
          ctx.fillText(col.name, node.x + 36, colY + 15);

          // Column type
          ctx.fillStyle = '#64748b';
          ctx.font = '10px "Fira Code", monospace';
          ctx.fillText(col.type, node.x + node.width - 85, colY + 15);
        });
      });

      ctx.restore();
    }

    roundRect(ctx, x, y, width, height, radius, fill, stroke) {
      if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
      } else {
        radius = Object.assign({ tl: 0, tr: 0, br: 0, bl: 0 }, radius);
      }
      ctx.beginPath();
      ctx.moveTo(x + radius.tl, y);
      ctx.lineTo(x + width - radius.tr, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
      ctx.lineTo(x + width, y + height - radius.br);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
      ctx.lineTo(x + radius.bl, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
      ctx.lineTo(x, y + radius.tl);
      ctx.quadraticCurveTo(x, y, x + radius.tl, y);
      ctx.closePath();
      if (fill) ctx.fill();
      if (stroke) ctx.stroke();
    }

    showTableDetailDrawer(node) {
      const drawer = document.getElementById('erd-detail-drawer');
      const title = document.getElementById('drawer-table-name');
      const body = document.getElementById('drawer-table-details');

      if (!drawer || !title || !body) return;

      title.textContent = `Table: ${node.name}`;
      let html = `<p><strong>Total Records:</strong> ${node.rowCount}</p>`;
      html += `<div style="margin-top: 8px;"><strong>Schema Fields:</strong></div><ul style="padding-left: 18px; margin-top: 4px;">`;
      node.columns.forEach(c => {
        html += `<li><code>${c.name}</code> (${c.type}) ${c.isPk ? '<strong>[PK]</strong>' : ''} ${c.isFk ? '<em>[FK]</em>' : ''}</li>`;
      });
      html += `</ul>`;

      body.innerHTML = html;
      drawer.classList.remove('hidden');

      document.getElementById('drawer-btn-select-all').onclick = () => {
        const sqlInput = document.getElementById('sql-input');
        sqlInput.value = `SELECT * FROM ${node.name} LIMIT 20;`;
        switchTab('tab-sql-grid');
        runQuery();
      };
    }
  }

  // ============================================================================
  // 6. DYNAMIC CANVAS CHARTING ENGINE
  // ============================================================================
  class DynamicChartEngine {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.chartType = 'bar';
      this.xAxisCol = '';
      this.yAxisCol = '';
      this.agg = 'raw';
      this.data = [];
      this.colorPalette = ['#00e5ff', '#a855f7', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'];
    }

    setData(rows, columns) {
      this.data = rows;
      this.columns = columns;
      this.populateAxisSelectors();
      this.render();
    }

    populateAxisSelectors() {
      const xSelect = document.getElementById('chart-x-axis');
      const ySelect = document.getElementById('chart-y-axis');
      if (!xSelect || !ySelect) return;

      xSelect.innerHTML = '';
      ySelect.innerHTML = '';

      this.columns.forEach(col => {
        const optX = document.createElement('option');
        optX.value = col;
        optX.textContent = col;
        xSelect.appendChild(optX);

        const optY = document.createElement('option');
        optY.value = col;
        optY.textContent = col;
        ySelect.appendChild(optY);
      });

      // Default smart picks
      this.xAxisCol = this.columns[0];
      const numericCol = this.columns.find(c => {
        return this.data.length && !isNaN(Number(this.data[0][c])) && typeof this.data[0][c] !== 'boolean';
      });
      this.yAxisCol = numericCol || (this.columns[1] || this.columns[0]);

      xSelect.value = this.xAxisCol;
      ySelect.value = this.yAxisCol;
    }

    setChartType(type) {
      this.chartType = type;
      this.render();
    }

    render() {
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;

      ctx.clearRect(0, 0, w, h);

      if (!this.data || this.data.length === 0) {
        ctx.fillStyle = '#64748b';
        ctx.font = '14px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('No data available to plot chart. Execute a query with records.', w / 2, h / 2);
        return;
      }

      // Prepare data series
      const xLabels = this.data.map(r => String(r[this.xAxisCol] ?? ''));
      const yValues = this.data.map(r => Number(r[this.yAxisCol]) || 0);

      const maxVal = Math.max(...yValues, 1);
      const minVal = Math.min(...yValues, 0);

      // Update summary KPI pills
      const countEl = document.querySelector('#insight-count span');
      const maxEl = document.querySelector('#insight-max span');
      const minEl = document.querySelector('#insight-min span');
      const avgEl = document.querySelector('#insight-avg span');

      if (countEl) countEl.textContent = this.data.length;
      if (maxEl) maxEl.textContent = maxVal.toLocaleString();
      if (minEl) minEl.textContent = minVal.toLocaleString();
      if (avgEl) {
        const sum = yValues.reduce((a, b) => a + b, 0);
        avgEl.textContent = (sum / yValues.length).toFixed(1);
      }

      const padding = { top: 40, right: 40, bottom: 60, left: 70 };
      const chartW = w - padding.left - padding.right;
      const chartH = h - padding.top - padding.bottom;

      switch (this.chartType) {
        case 'bar':
          this.renderBarChart(ctx, xLabels, yValues, padding, chartW, chartH, maxVal);
          break;
        case 'line':
          this.renderLineChart(ctx, xLabels, yValues, padding, chartW, chartH, maxVal, false);
          break;
        case 'area':
          this.renderLineChart(ctx, xLabels, yValues, padding, chartW, chartH, maxVal, true);
          break;
        case 'donut':
          this.renderDonutChart(ctx, xLabels, yValues, w, h);
          break;
        case 'scatter':
          this.renderScatterChart(ctx, xLabels, yValues, padding, chartW, chartH, maxVal);
          break;
      }
    }

    renderBarChart(ctx, labels, values, pad, cw, ch, maxVal) {
      const barWidth = Math.min((cw / values.length) * 0.6, 50);
      const gap = cw / values.length;

      // Draw Grid Lines
      this.drawAxesAndGrid(ctx, pad, cw, ch, maxVal);

      values.forEach((val, idx) => {
        const barHeight = (val / maxVal) * ch;
        const x = pad.left + idx * gap + (gap - barWidth) / 2;
        const y = pad.top + ch - barHeight;

        // Gradient Bar
        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, '#00e5ff');
        grad.addColorStop(1, 'rgba(0, 229, 255, 0.2)');

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Top cap glow
        ctx.fillStyle = '#00e5ff';
        ctx.fillRect(x, y, barWidth, 3);

        // X Label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        const labelText = labels[idx].length > 10 ? labels[idx].slice(0, 8) + '...' : labels[idx];
        ctx.fillText(labelText, x + barWidth / 2, pad.top + ch + 20);

        // Value on bar top
        ctx.fillStyle = '#00e5ff';
        ctx.font = '10px "Fira Code", monospace';
        ctx.fillText(val.toLocaleString(), x + barWidth / 2, y - 6);
      });
    }

    renderLineChart(ctx, labels, values, pad, cw, ch, maxVal, isArea) {
      this.drawAxesAndGrid(ctx, pad, cw, ch, maxVal);

      const step = cw / (values.length - 1 || 1);
      const points = values.map((val, idx) => ({
        x: pad.left + idx * step,
        y: pad.top + ch - (val / maxVal) * ch
      }));

      if (isArea) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, pad.top + ch);
        points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(points[points.length - 1].x, pad.top + ch);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch);
        grad.addColorStop(0, 'rgba(168, 85, 247, 0.4)');
        grad.addColorStop(1, 'rgba(168, 85, 247, 0.0)');
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Draw Main Line
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw Nodes
      points.forEach((p, idx) => {
        ctx.fillStyle = '#161b24';
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        const labelText = labels[idx].length > 8 ? labels[idx].slice(0, 6) + '..' : labels[idx];
        ctx.fillText(labelText, p.x, pad.top + ch + 20);
      });
    }

    renderDonutChart(ctx, labels, values, w, h) {
      const centerX = w / 2;
      const centerY = h / 2;
      const radius = Math.min(w, h) * 0.32;
      const innerRadius = radius * 0.6;
      const total = values.reduce((a, b) => a + b, 0) || 1;

      let curAngle = -Math.PI / 2;

      values.forEach((val, idx) => {
        const sliceAngle = (val / total) * Math.PI * 2;
        const color = this.colorPalette[idx % this.colorPalette.length];

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, curAngle, curAngle + sliceAngle);
        ctx.arc(centerX, centerY, innerRadius, curAngle + sliceAngle, curAngle, true);
        ctx.closePath();

        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#0f1319';
        ctx.lineWidth = 3;
        ctx.stroke();

        curAngle += sliceAngle;
      });

      // Center summary
      ctx.fillStyle = '#f1f5f9';
      ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Distribution', centerX, centerY - 6);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px "Fira Code", monospace';
      ctx.fillText(`${values.length} slices`, centerX, centerY + 14);
    }

    renderScatterChart(ctx, labels, values, pad, cw, ch, maxVal) {
      this.drawAxesAndGrid(ctx, pad, cw, ch, maxVal);

      values.forEach((val, idx) => {
        const x = pad.left + Math.random() * cw;
        const y = pad.top + ch - (val / maxVal) * ch;

        ctx.fillStyle = 'rgba(0, 229, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    }

    drawAxesAndGrid(ctx, pad, cw, ch, maxVal) {
      ctx.strokeStyle = '#242c3d';
      ctx.lineWidth = 1;

      // Y-axis grid lines (5 steps)
      const steps = 5;
      for (let i = 0; i <= steps; i++) {
        const y = pad.top + (ch / steps) * i;
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(pad.left + cw, y);
        ctx.stroke();

        const valLabel = Math.round(maxVal - (maxVal / steps) * i);
        ctx.fillStyle = '#64748b';
        ctx.font = '10px "Fira Code", monospace';
        ctx.textAlign = 'right';
        ctx.fillText(valLabel.toLocaleString(), pad.left - 10, y + 4);
      }

      // X-axis line
      ctx.beginPath();
      ctx.moveTo(pad.left, pad.top + ch);
      ctx.lineTo(pad.left + cw, pad.top + ch);
      ctx.strokeStyle = '#323d52';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  // ============================================================================
  // 7. APPLICATION CONTROLLER & UI WIRING
  // ============================================================================
  let erdVisualizer = null;
  let chartEngine = null;

  function initApp() {
    renderSidebarSchema();
    renderPromptChips();

    const erdCanvas = document.getElementById('erd-canvas');
    if (erdCanvas) {
      erdVisualizer = new ErdVisualizer(erdCanvas, activeDb);
      erdVisualizer.render();
    }

    const chartCanvas = document.getElementById('analytics-canvas');
    if (chartCanvas) {
      chartEngine = new DynamicChartEngine(chartCanvas);
    }

    setupEventListeners();

    // Initial default query execution
    runQuery();
  }

  function setupEventListeners() {
    // Database Selector Change
    const dbSelect = document.getElementById('db-select');
    if (dbSelect) {
      dbSelect.addEventListener('change', (e) => {
        currentDbKey = e.target.value;
        activeDb = JSON.parse(JSON.stringify(DATABASES[currentDbKey]));
        engine.setDatabase(activeDb);
        synthesizer.setDatabase(activeDb);
        if (erdVisualizer) erdVisualizer.setDatabase(activeDb);

        renderSidebarSchema();
        renderPromptChips();

        // Update header & footer indicators
        document.getElementById('active-db-indicator').textContent = `DB: ${currentDbKey}`;
        const firstTable = Object.keys(activeDb.tables)[0];
        document.getElementById('sql-input').value = `SELECT * FROM ${firstTable} LIMIT 15;`;

        audio.playWhoosh();
        runQuery();
      });
    }

    // Natural Language Query Bar
    const btnGenSql = document.getElementById('btn-generate-sql');
    const nlInput = document.getElementById('nl-query-input');
    if (btnGenSql && nlInput) {
      const handleNLSubmit = () => {
        const val = nlInput.value.trim();
        if (!val) return;

        audio.playWhoosh();
        const synthesized = synthesizer.synthesize(val);
        const sqlInput = document.getElementById('sql-input');
        sqlInput.value = synthesized;

        const confPill = document.getElementById('nl-trans-confidence');
        if (confPill) {
          confPill.classList.remove('hidden');
          setTimeout(() => confPill.classList.add('hidden'), 5000);
        }

        switchTab('tab-sql-grid');
        runQuery();
      };

      btnGenSql.addEventListener('click', handleNLSubmit);
      nlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleNLSubmit();
        }
      });
    }

    // SQL Editor Controls
    const btnRun = document.getElementById('btn-run-sql');
    if (btnRun) btnRun.addEventListener('click', () => runQuery());

    const btnClear = document.getElementById('btn-clear-sql');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        document.getElementById('sql-input').value = '';
        audio.playClick();
      });
    }

    const btnFormat = document.getElementById('btn-format-sql');
    if (btnFormat) {
      btnFormat.addEventListener('click', () => {
        const sql = document.getElementById('sql-input');
        sql.value = formatSql(sql.value);
        audio.playClick();
      });
    }

    // Workstation Tabs Navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-tab');
        switchTab(targetId);
        audio.playClick();
      });
    });

    // Audio Toggle
    const btnAudio = document.getElementById('btn-audio-toggle');
    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        audio.muted = !audio.muted;
        document.getElementById('audio-icon').textContent = audio.muted ? '🔇' : '🔊';
        document.getElementById('audio-text').textContent = audio.muted ? 'Audio OFF' : 'Audio ON';
      });
    }

    // Modal DDL Dialog
    const btnDdl = document.getElementById('btn-schema-ddl');
    const ddlDialog = document.getElementById('ddl-dialog');
    if (btnDdl && ddlDialog) {
      btnDdl.addEventListener('click', () => {
        document.getElementById('ddl-code-block').textContent = generateDdl(activeDb);
        ddlDialog.showModal();
        audio.playClick();
      });
      document.getElementById('btn-close-ddl').addEventListener('click', () => ddlDialog.close());
      document.getElementById('btn-close-ddl-btn').addEventListener('click', () => ddlDialog.close());
      document.getElementById('btn-copy-ddl').addEventListener('click', () => {
        navigator.clipboard.writeText(generateDdl(activeDb));
        audio.playSuccess();
        alert('Database DDL copied to clipboard!');
      });
    }

    // Modal Help Dialog
    const btnHelp = document.getElementById('btn-help-modal');
    const helpDialog = document.getElementById('help-dialog');
    if (btnHelp && helpDialog) {
      btnHelp.addEventListener('click', () => {
        helpDialog.showModal();
        audio.playClick();
      });
      document.getElementById('btn-close-help').addEventListener('click', () => helpDialog.close());
      document.getElementById('btn-close-help-btn').addEventListener('click', () => helpDialog.close());
    }

    // Data Export Buttons
    document.getElementById('btn-export-csv').addEventListener('click', exportCsv);
    document.getElementById('btn-export-json').addEventListener('click', exportJson);
    document.getElementById('btn-export-markdown').addEventListener('click', exportMarkdown);

    // Switch to chart view button in grid toolbar
    document.getElementById('btn-visualize-grid').addEventListener('click', () => {
      switchTab('tab-data-charts');
      audio.playClick();
    });

    // Chart Types
    document.querySelectorAll('#chart-type-group .btn-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#chart-type-group .btn-toggle').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (chartEngine) {
          chartEngine.setChartType(btn.getAttribute('data-chart'));
          audio.playClick();
        }
      });
    });

    // Chart Axes Change
    document.getElementById('chart-x-axis').addEventListener('change', (e) => {
      if (chartEngine) {
        chartEngine.xAxisCol = e.target.value;
        chartEngine.render();
      }
    });

    document.getElementById('chart-y-axis').addEventListener('change', (e) => {
      if (chartEngine) {
        chartEngine.yAxisCol = e.target.value;
        chartEngine.render();
      }
    });

    // ERD Canvas Controls
    document.getElementById('btn-erd-zoom-in').addEventListener('click', () => {
      if (erdVisualizer) {
        erdVisualizer.scale = Math.min(erdVisualizer.scale * 1.15, 2.2);
        erdVisualizer.render();
        audio.playClick();
      }
    });

    document.getElementById('btn-erd-zoom-out').addEventListener('click', () => {
      if (erdVisualizer) {
        erdVisualizer.scale = Math.max(erdVisualizer.scale * 0.85, 0.4);
        erdVisualizer.render();
        audio.playClick();
      }
    });

    document.getElementById('btn-erd-reset-view').addEventListener('click', () => {
      if (erdVisualizer) {
        erdVisualizer.scale = 1.0;
        erdVisualizer.panX = 40;
        erdVisualizer.panY = 40;
        erdVisualizer.render();
        audio.playClick();
      }
    });

    document.getElementById('btn-erd-rearrange').addEventListener('click', () => {
      if (erdVisualizer) {
        erdVisualizer.initNodes();
        erdVisualizer.render();
        audio.playWhoosh();
      }
    });

    // Drawer Close
    const drawerClose = document.getElementById('drawer-close');
    if (drawerClose) {
      drawerClose.addEventListener('click', () => {
        document.getElementById('erd-detail-drawer').classList.add('hidden');
      });
    }

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        runQuery();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const input = document.getElementById('nl-query-input');
        if (input) input.focus();
      }
      if (e.key === 'Escape') {
        const dialogs = document.querySelectorAll('dialog[open]');
        dialogs.forEach(d => d.close());
        document.getElementById('erd-detail-drawer').classList.add('hidden');
      }
    });
  }

  function switchTab(tabId) {
    currentActiveTab = tabId;
    document.querySelectorAll('.workstation-nav .nav-tab').forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-tab') === tabId);
    });
    document.querySelectorAll('.tab-content').forEach(c => {
      c.classList.toggle('active', c.id === tabId);
    });

    if (tabId === 'tab-erd-canvas' && erdVisualizer) {
      setTimeout(() => erdVisualizer.render(), 50);
    }
    if (tabId === 'tab-data-charts' && chartEngine) {
      setTimeout(() => chartEngine.render(), 50);
    }
  }

  function runQuery() {
    const sql = document.getElementById('sql-input').value;
    const statStatus = document.getElementById('stat-query-status');
    const statTime = document.getElementById('stat-query-time');
    const statRows = document.getElementById('stat-query-rows');
    const statCols = document.getElementById('stat-query-cols');
    const statScanned = document.getElementById('stat-scanned-rows');

    try {
      const result = engine.execute(sql);
      currentQueryResult = result;

      statStatus.textContent = 'SUCCESS';
      statStatus.className = 'val success';
      statTime.textContent = `${result.executionTimeMs} ms`;
      statRows.textContent = `${result.rows.length} rows`;
      statCols.textContent = `${result.columns.length} cols`;
      statScanned.textContent = `${result.scannedRows} rows`;

      renderResultsGrid(result);
      renderExecutionPlan(result.queryPlan, result.executionTimeMs);

      if (chartEngine) {
        chartEngine.setData(result.rows, result.columns);
      }

      audio.playSuccess();
    } catch (err) {
      statStatus.textContent = 'ERROR';
      statStatus.className = 'val error';
      statTime.textContent = '0.0 ms';
      statRows.textContent = '0 rows';
      statCols.textContent = '0 cols';

      const tbody = document.getElementById('grid-tbody');
      if (tbody) {
        tbody.innerHTML = `<tr><td colspan="10" style="color: #f43f5e; padding: 20px;"><strong>Query Execution Error:</strong> ${err.message}</td></tr>`;
      }
      audio.playError();
    }
  }

  function renderResultsGrid(result) {
    const thead = document.getElementById('grid-thead');
    const tbody = document.getElementById('grid-tbody');
    const emptyState = document.getElementById('grid-empty-state');
    const paginationInfo = document.getElementById('pagination-info');

    thead.innerHTML = '';
    tbody.innerHTML = '';

    if (!result.rows || result.rows.length === 0) {
      emptyState.classList.remove('hidden');
      paginationInfo.textContent = '0 records returned';
      return;
    }

    emptyState.classList.add('hidden');
    paginationInfo.textContent = `Showing 1-${result.rows.length} of ${result.rows.length} records`;

    // Render Table Header
    const trHead = document.createElement('tr');
    result.columns.forEach(col => {
      const th = document.createElement('th');
      th.innerHTML = `${col} <span class="sort-indicator">↕</span>`;
      th.addEventListener('click', () => sortGridByColumn(col));
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);

    // Render Table Rows
    result.rows.forEach(row => {
      const tr = document.createElement('tr');
      result.columns.forEach(col => {
        const td = document.createElement('td');
        const val = row[col];
        td.textContent = val === null || val === undefined ? 'NULL' : val;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  function sortGridByColumn(col) {
    if (!currentQueryResult || !currentQueryResult.rows) return;
    const dir = currentSort.column === col && currentSort.direction === 'asc' ? 'desc' : 'asc';
    currentSort = { column: col, direction: dir };

    currentQueryResult.rows.sort((a, b) => {
      let va = a[col];
      let vb = b[col];
      if (!isNaN(Number(va)) && !isNaN(Number(vb))) {
        va = Number(va);
        vb = Number(vb);
      }
      if (va < vb) return dir === 'asc' ? -1 : 1;
      if (va > vb) return dir === 'asc' ? 1 : -1;
      return 0;
    });

    renderResultsGrid(currentQueryResult);
    audio.playClick();
  }

  function renderExecutionPlan(planSteps, totalTime) {
    const tree = document.getElementById('execution-pipeline-tree');
    if (!tree) return;
    tree.innerHTML = '';

    planSteps.forEach((step, idx) => {
      const card = document.createElement('div');
      card.className = 'plan-node-card';
      card.innerHTML = `
        <div class="node-bullet"></div>
        <div class="node-info-left">
          <span class="node-op-name">${step.op}</span>
          <span class="node-op-details">${step.detail}</span>
        </div>
        <div class="node-metrics-right">
          <div class="node-metric">
            <span class="val">${step.rows}</span>
            <span class="lbl">Rows Est.</span>
          </div>
          <div class="node-metric">
            <span class="val">${step.cost}</span>
            <span class="lbl">Est. Cost</span>
          </div>
        </div>
      `;
      tree.appendChild(card);
    });
  }

  function renderSidebarSchema() {
    const list = document.getElementById('schema-tables-list');
    const badge = document.getElementById('table-count-badge');
    const fkVal = document.getElementById('fk-count-val');

    if (!list) return;
    list.innerHTML = '';

    const tables = Object.keys(activeDb.tables);
    if (badge) badge.textContent = `${tables.length} Tables`;

    let totalFk = 0;
    tables.forEach(tblKey => {
      const tbl = activeDb.tables[tblKey];
      const item = document.createElement('div');
      item.className = 'schema-table-item';

      let colsHtml = '';
      tbl.columns.forEach(col => {
        if (col.isFk) totalFk++;
        colsHtml += `
          <div class="schema-column-row">
            <div class="column-name-box">
              ${col.isPk ? '<span class="pk-badge">PK</span>' : ''}
              ${col.isFk ? '<span class="fk-badge">FK</span>' : ''}
              <span>${col.name}</span>
            </div>
            <span class="column-type">${col.type}</span>
          </div>
        `;
      });

      item.innerHTML = `
        <div class="schema-table-header">
          <div class="table-header-left">
            <span class="table-chevron">▶</span>
            <span class="table-name">${tblKey}</span>
          </div>
          <div class="table-actions">
            <span class="table-row-count">${tbl.rows.length}</span>
            <button class="btn-table-query" title="Query table">⚡</button>
          </div>
        </div>
        <div class="schema-columns-list">${colsHtml}</div>
      `;

      item.querySelector('.schema-table-header').addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-table-query')) return;
        item.classList.toggle('expanded');
        audio.playClick();
      });

      item.querySelector('.btn-table-query').addEventListener('click', () => {
        document.getElementById('sql-input').value = `SELECT * FROM ${tblKey} LIMIT 20;`;
        switchTab('tab-sql-grid');
        runQuery();
      });

      list.appendChild(item);
    });

    if (fkVal) fkVal.textContent = `${totalFk} relations`;
  }

  function renderPromptChips() {
    const container = document.getElementById('prompt-chips-container');
    if (!container) return;
    container.innerHTML = '';

    (activeDb.prompts || []).forEach(p => {
      const chip = document.createElement('div');
      chip.className = 'prompt-chip';
      chip.textContent = p.label;
      chip.addEventListener('click', () => {
        document.getElementById('nl-query-input').value = p.query;
        document.getElementById('btn-generate-sql').click();
      });
      container.appendChild(chip);
    });
  }

  function generateDdl(db) {
    let ddl = `-- NeuroQuery Studio Auto-Generated Schema DDL\n-- Dialect: ${db.dialect}\n\n`;
    Object.keys(db.tables).forEach(tKey => {
      const tbl = db.tables[tKey];
      ddl += `CREATE TABLE ${tKey} (\n`;
      const colDefs = tbl.columns.map(c => {
        let def = `  ${c.name.padEnd(16)} ${c.type}`;
        if (c.isPk) def += ' PRIMARY KEY';
        if (c.isFk && c.fkRef) def += ` REFERENCES ${c.fkRef.table}(${c.fkRef.col})`;
        return def;
      });
      ddl += colDefs.join(',\n') + '\n);\n\n';
    });
    return ddl;
  }

  function formatSql(sql) {
    return sql
      .replace(/\s+/g, ' ')
      .replace(/\s*(SELECT|FROM|WHERE|JOIN|ON|GROUP BY|ORDER BY|LIMIT)\s*/gi, '\n$1 ')
      .trim();
  }

  function exportCsv() {
    if (!currentQueryResult || !currentQueryResult.rows.length) return;
    const cols = currentQueryResult.columns;
    const csvRows = [cols.join(',')];

    currentQueryResult.rows.forEach(row => {
      const vals = cols.map(c => `"${String(row[c] ?? '').replace(/"/g, '""')}"`);
      csvRows.push(vals.join(','));
    });

    downloadBlob(csvRows.join('\n'), 'neuroquery_export.csv', 'text/csv');
    audio.playSuccess();
  }

  function exportJson() {
    if (!currentQueryResult || !currentQueryResult.rows.length) return;
    downloadBlob(JSON.stringify(currentQueryResult.rows, null, 2), 'neuroquery_export.json', 'application/json');
    audio.playSuccess();
  }

  function exportMarkdown() {
    if (!currentQueryResult || !currentQueryResult.rows.length) return;
    const cols = currentQueryResult.columns;
    let md = '| ' + cols.join(' | ') + ' |\n';
    md += '| ' + cols.map(() => '---').join(' | ') + ' |\n';

    currentQueryResult.rows.forEach(r => {
      md += '| ' + cols.map(c => r[c] ?? '').join(' | ') + ' |\n';
    });

    navigator.clipboard.writeText(md);
    audio.playSuccess();
    alert('Query results copied to clipboard as Markdown table!');
  }

  function downloadBlob(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
