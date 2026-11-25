/**
 * ============================================================================
 * NEUROQUERY STUDIO — ENTERPRISE ENGINE (v1.0 • Launchpad Cycle #4)
 * Professional Relational SQL IDE, Multi-Tab Workbench, AI Copilot & ERD Architect
 *
 * Developer: Divyansh Shandil (0612divyansh)
 * ============================================================================
 */

(function () {
  'use strict';

  // ============================================================================
  // 1. TACTILE AUDIO SYNTHESIZER
  // ============================================================================
  class AudioSynthesizer {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.initialized = false;
    }

    init() {
      if (this.initialized) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          this.initialized = true;
        }
      } catch (e) {
        console.warn('Web Audio unavailable', e);
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
      osc.frequency.setValueAtTime(550, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.035);
    }

    playExecute() {
      if (this.muted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    }

    playSuccess() {
      if (this.muted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + idx * 0.04;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, start);

        gain.gain.setValueAtTime(0.07, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.16);
      });
    }

    playError() {
      if (this.muted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.16);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    }
  }

  const audio = new AudioSynthesizer();

  // ============================================================================
  // 2. ENTERPRISE RELATIONAL SCHEMAS & PRE-SEEDED DATA
  // ============================================================================
  const DATABASES = {
    saas_analytics: {
      name: 'saas_analytics',
      dialect: 'PostgreSQL 16.2',
      tables: {
        organizations: {
          columns: [
            { name: 'org_id', type: 'int4', isPk: true, isFk: false },
            { name: 'name', type: 'varchar(80)', isPk: false, isFk: false },
            { name: 'tier', type: 'varchar(40)', isPk: false, isFk: false },
            { name: 'created_at', type: 'date', isPk: false, isFk: false },
            { name: 'mrr', type: 'numeric(10,2)', isPk: false, isFk: false },
            { name: 'status', type: 'varchar(20)', isPk: false, isFk: false }
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
            { name: 'user_id', type: 'int4', isPk: true, isFk: false },
            { name: 'org_id', type: 'int4', isPk: false, isFk: true, fkRef: { table: 'organizations', col: 'org_id' } },
            { name: 'email', type: 'varchar(120)', isPk: false, isFk: false },
            { name: 'role', type: 'varchar(40)', isPk: false, isFk: false },
            { name: 'last_login', type: 'timestamp', isPk: false, isFk: false },
            { name: 'is_active', type: 'boolean', isPk: false, isFk: false }
          ],
          rows: [
            { user_id: 101, org_id: 1, email: 'alice@vortex.io', role: 'admin', last_login: '2026-11-24 14:22:00', is_active: true },
            { user_id: 102, org_id: 1, email: 'bob@vortex.io', role: 'developer', last_login: '2026-11-23 09:15:30', is_active: true },
            { user_id: 103, org_id: 2, email: 'carol@novalabs.tech', role: 'admin', last_login: '2026-11-25 18:04:12', is_active: true },
            { user_id: 104, org_id: 3, email: 'dan@apex-ai.com', role: 'owner', last_login: '2026-11-25 11:45:00', is_active: true },
            { user_id: 105, org_id: 3, email: 'elena@apex-ai.com', role: 'developer', last_login: '2026-11-22 16:30:10', is_active: true },
            { user_id: 106, org_id: 4, email: 'frank@bytesync.co', role: 'owner', last_login: '2026-11-15 08:12:00', is_active: false },
            { user_id: 107, org_id: 5, email: 'grace@luminary.design', role: 'admin', last_login: '2026-11-24 19:20:00', is_active: true },
            { user_id: 108, org_id: 6, email: 'hank@hyperflow.net', role: 'analyst', last_login: '2026-11-21 13:10:45', is_active: true },
            { user_id: 109, org_id: 7, email: 'iris@krypton.io', role: 'owner', last_login: '2026-10-18 10:00:00', is_active: false },
            { user_id: 110, org_id: 8, email: 'divyansh@pulsemetrics.io', role: 'owner', last_login: '2026-11-25 20:15:00', is_active: true }
          ]
        },
        subscriptions: {
          columns: [
            { name: 'sub_id', type: 'int4', isPk: true, isFk: false },
            { name: 'org_id', type: 'int4', isPk: false, isFk: true, fkRef: { table: 'organizations', col: 'org_id' } },
            { name: 'plan', type: 'varchar(60)', isPk: false, isFk: false },
            { name: 'seats', type: 'int4', isPk: false, isFk: false },
            { name: 'monthly_amount', type: 'numeric(10,2)', isPk: false, isFk: false },
            { name: 'renews_on', type: 'date', isPk: false, isFk: false },
            { name: 'status', type: 'varchar(20)', isPk: false, isFk: false }
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
            { name: 'invoice_id', type: 'int4', isPk: true, isFk: false },
            { name: 'org_id', type: 'int4', isPk: false, isFk: true, fkRef: { table: 'organizations', col: 'org_id' } },
            { name: 'amount', type: 'numeric(10,2)', isPk: false, isFk: false },
            { name: 'status', type: 'varchar(20)', isPk: false, isFk: false },
            { name: 'paid_at', type: 'date', isPk: false, isFk: false },
            { name: 'currency', type: 'varchar(6)', isPk: false, isFk: false }
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
            { name: 'usage_id', type: 'int4', isPk: true, isFk: false },
            { name: 'org_id', type: 'int4', isPk: false, isFk: true, fkRef: { table: 'organizations', col: 'org_id' } },
            { name: 'feature_key', type: 'varchar(60)', isPk: false, isFk: false },
            { name: 'calls_count', type: 'int4', isPk: false, isFk: false },
            { name: 'latency_p95_ms', type: 'numeric(6,2)', isPk: false, isFk: false }
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
        { label: 'Top Organizations by MRR', query: 'SELECT org_id, name, tier, mrr, status FROM organizations ORDER BY mrr DESC LIMIT 5;' },
        { label: 'Enterprise Subscriptions', query: 'SELECT sub_id, org_id, plan, seats, monthly_amount, status FROM subscriptions WHERE status = \'active\' ORDER BY monthly_amount DESC;' },
        { label: 'Active Admins', query: 'SELECT user_id, email, role, last_login FROM users WHERE role = \'admin\' AND is_active = true;' },
        { label: 'Unpaid Invoices', query: 'SELECT invoice_id, org_id, amount, status, currency FROM invoices WHERE status = \'unpaid\';' },
        { label: 'High-Volume AI Features', query: 'SELECT usage_id, org_id, feature_key, calls_count, latency_p95_ms FROM features_usage WHERE feature_key = \'ai_copilot_inference\' ORDER BY calls_count DESC;' }
      ]
    },

    fintech_ledger: {
      name: 'fintech_ledger',
      dialect: 'PostgreSQL 16.2',
      tables: {
        accounts: {
          columns: [
            { name: 'account_id', type: 'int4', isPk: true, isFk: false },
            { name: 'account_number', type: 'varchar(30)', isPk: false, isFk: false },
            { name: 'holder_name', type: 'varchar(80)', isPk: false, isFk: false },
            { name: 'tier', type: 'varchar(30)', isPk: false, isFk: false },
            { name: 'balance', type: 'numeric(12,2)', isPk: false, isFk: false },
            { name: 'currency', type: 'varchar(5)', isPk: false, isFk: false }
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
            { name: 'merchant_id', type: 'int4', isPk: true, isFk: false },
            { name: 'merchant_name', type: 'varchar(80)', isPk: false, isFk: false },
            { name: 'category', type: 'varchar(50)', isPk: false, isFk: false },
            { name: 'risk_score', type: 'numeric(4,2)', isPk: false, isFk: false },
            { name: 'commission_rate', type: 'numeric(4,3)', isPk: false, isFk: false }
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
            { name: 'txn_id', type: 'int4', isPk: true, isFk: false },
            { name: 'account_id', type: 'int4', isPk: false, isFk: true, fkRef: { table: 'accounts', col: 'account_id' } },
            { name: 'merchant_id', type: 'int4', isPk: false, isFk: true, fkRef: { table: 'merchants', col: 'merchant_id' } },
            { name: 'amount', type: 'numeric(10,2)', isPk: false, isFk: false },
            { name: 'txn_type', type: 'varchar(20)', isPk: false, isFk: false },
            { name: 'status', type: 'varchar(20)', isPk: false, isFk: false },
            { name: 'created_at', type: 'date', isPk: false, isFk: false }
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
            { name: 'settlement_id', type: 'int4', isPk: true, isFk: false },
            { name: 'merchant_id', type: 'int4', isPk: false, isFk: true, fkRef: { table: 'merchants', col: 'merchant_id' } },
            { name: 'net_amount', type: 'numeric(12,2)', isPk: false, isFk: false },
            { name: 'fee_deducted', type: 'numeric(10,2)', isPk: false, isFk: false },
            { name: 'settled_at', type: 'date', isPk: false, isFk: false }
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
            { name: 'alert_id', type: 'int4', isPk: true, isFk: false },
            { name: 'txn_id', type: 'int4', isPk: false, isFk: true, fkRef: { table: 'transactions', col: 'txn_id' } },
            { name: 'severity', type: 'varchar(20)', isPk: false, isFk: false },
            { name: 'rule_triggered', type: 'varchar(80)', isPk: false, isFk: false },
            { name: 'review_status', type: 'varchar(30)', isPk: false, isFk: false }
          ],
          rows: [
            { alert_id: 701, txn_id: 8804, severity: 'HIGH', rule_triggered: 'VELOCITY_LIMIT_EXCEEDED', review_status: 'PENDING_MANUAL' }
          ]
        }
      },
      prompts: [
        { label: 'High Balance Accounts', query: 'SELECT account_id, holder_name, tier, balance, currency FROM accounts WHERE balance > 50000 ORDER BY balance DESC;' },
        { label: 'Flagged Transactions', query: 'SELECT txn_id, account_id, amount, txn_type, status FROM transactions WHERE status = \'FLAGGED\';' },
        { label: 'Risk Ranking Merchants', query: 'SELECT merchant_id, merchant_name, category, risk_score FROM merchants ORDER BY risk_score DESC;' },
        { label: 'UPI Volume', query: 'SELECT txn_id, account_id, amount, status FROM transactions WHERE txn_type = \'UPI\';' }
      ]
    },

    ecommerce_global: {
      name: 'ecommerce_global',
      dialect: 'PostgreSQL 16.2',
      tables: {
        customers: {
          columns: [
            { name: 'customer_id', type: 'int4', isPk: true, isFk: false },
            { name: 'full_name', type: 'varchar(80)', isPk: false, isFk: false },
            { name: 'country', type: 'varchar(40)', isPk: false, isFk: false },
            { name: 'tier', type: 'varchar(30)', isPk: false, isFk: false },
            { name: 'total_spend', type: 'numeric(10,2)', isPk: false, isFk: false }
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
            { name: 'product_id', type: 'int4', isPk: true, isFk: false },
            { name: 'title', type: 'varchar(100)', isPk: false, isFk: false },
            { name: 'category', type: 'varchar(50)', isPk: false, isFk: false },
            { name: 'price', type: 'numeric(10,2)', isPk: false, isFk: false },
            { name: 'stock_qty', type: 'int4', isPk: false, isFk: false },
            { name: 'rating', type: 'numeric(3,2)', isPk: false, isFk: false }
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
            { name: 'warehouse_id', type: 'int4', isPk: true, isFk: false },
            { name: 'region', type: 'varchar(50)', isPk: false, isFk: false },
            { name: 'capacity_sqft', type: 'int4', isPk: false, isFk: false },
            { name: 'utilization_pct', type: 'numeric(5,2)', isPk: false, isFk: false }
          ],
          rows: [
            { warehouse_id: 1, region: 'Asia-Pacific (Singapore)', capacity_sqft: 250000, utilization_pct: 82.5 },
            { warehouse_id: 2, region: 'Europe (Frankfurt)', capacity_sqft: 400000, utilization_pct: 74.0 },
            { warehouse_id: 3, region: 'North America (Dallas)', capacity_sqft: 650000, utilization_pct: 89.2 }
          ]
        },
        orders: {
          columns: [
            { name: 'order_id', type: 'int4', isPk: true, isFk: false },
            { name: 'customer_id', type: 'int4', isPk: false, isFk: true, fkRef: { table: 'customers', col: 'customer_id' } },
            { name: 'total_amount', type: 'numeric(10,2)', isPk: false, isFk: false },
            { name: 'order_status', type: 'varchar(30)', isPk: false, isFk: false },
            { name: 'placed_at', type: 'date', isPk: false, isFk: false }
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
            { name: 'item_id', type: 'int4', isPk: true, isFk: false },
            { name: 'order_id', type: 'int4', isPk: false, isFk: true, fkRef: { table: 'orders', col: 'order_id' } },
            { name: 'product_id', type: 'int4', isPk: false, isFk: true, fkRef: { table: 'products', col: 'product_id' } },
            { name: 'quantity', type: 'int4', isPk: false, isFk: false },
            { name: 'unit_price', type: 'numeric(10,2)', isPk: false, isFk: false }
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
            { name: 'shipment_id', type: 'int4', isPk: true, isFk: false },
            { name: 'order_id', type: 'int4', isPk: false, isFk: true, fkRef: { table: 'orders', col: 'order_id' } },
            { name: 'warehouse_id', type: 'int4', isPk: false, isFk: true, fkRef: { table: 'warehouses', col: 'warehouse_id' } },
            { name: 'carrier', type: 'varchar(40)', isPk: false, isFk: false },
            { name: 'tracking_status', type: 'varchar(30)', isPk: false, isFk: false },
            { name: 'delivery_days', type: 'int4', isPk: false, isFk: false }
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
        { label: 'Highest Rated Catalog', query: 'SELECT product_id, title, category, price, rating FROM products WHERE rating > 4.6 ORDER BY rating DESC;' },
        { label: 'VIP Customer Lifetime Spend', query: 'SELECT customer_id, full_name, country, tier, total_spend FROM customers WHERE tier LIKE \'%VIP%\' ORDER BY total_spend DESC;' },
        { label: 'Fastest Carrier Shipments', query: 'SELECT shipment_id, order_id, carrier, tracking_status, delivery_days FROM shipments WHERE delivery_days <= 3;' }
      ]
    }
  };

  // State
  let currentDbKey = 'saas_analytics';
  let activeDb = JSON.parse(JSON.stringify(DATABASES[currentDbKey]));
  let currentQueryResult = null;
  let currentSort = { column: null, direction: 'asc' };
  let currentResultView = 'view-grid';

  // Multi-tab query state
  const queryTabs = [
    {
      id: 'tab-1',
      title: 'query_main.sql',
      content: 'SELECT \n  org_id, \n  name, \n  tier, \n  mrr, \n  status \nFROM organizations \nORDER BY mrr DESC \nLIMIT 15;'
    },
    {
      id: 'tab-2',
      title: 'revenue_by_tier.sql',
      content: 'SELECT \n  sub_id, \n  org_id, \n  plan, \n  seats, \n  monthly_amount, \n  status \nFROM subscriptions \nWHERE status = \'active\' \nORDER BY monthly_amount DESC;'
    },
    {
      id: 'tab-3',
      title: 'active_admins.sql',
      content: 'SELECT \n  user_id, \n  email, \n  role, \n  last_login \nFROM users \nWHERE role = \'admin\' AND is_active = true \nORDER BY last_login DESC;'
    }
  ];
  let activeTabId = 'tab-1';

  // Execution History log
  const queryHistory = [];

  // ============================================================================
  // 3. RELATIONAL SQL ENGINE
  // ============================================================================
  class RelationalEngine {
    constructor(db) {
      this.db = db;
    }

    setDatabase(db) {
      this.db = db;
    }

    execute(sqlStr) {
      const startTime = performance.now();
      const cleanSql = sqlStr.trim().replace(/;+$/, '');

      if (!cleanSql) {
        throw new Error('Empty query string provided.');
      }

      const selectMatch = cleanSql.match(/^SELECT\s+([\s\S]+?)\s+FROM\s+([a-zA-Z0-9_]+)([\s\S]*)$/i);
      if (!selectMatch) {
        throw new Error('Syntax Error: Only SELECT queries are supported in client-side preview engine.');
      }

      const rawCols = selectMatch[1].trim();
      const primaryTable = selectMatch[2].trim().toLowerCase();
      const remainingClauses = selectMatch[3] || '';

      if (!this.db.tables[primaryTable]) {
        throw new Error(`Table not found: "${primaryTable}" in current database.`);
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

      // 1. JOIN
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

      // 2. WHERE
      const whereMatch = remainingClauses.match(/WHERE\s+([\s\S]+?)(?=(ORDER\s+BY|GROUP\s+BY|LIMIT|$))/i);
      if (whereMatch) {
        const whereCond = whereMatch[1].trim();
        sourceRows = sourceRows.filter(row => this.evaluateCondition(row, whereCond));
        planSteps.push({
          op: 'Filter',
          detail: `Filter: (${whereCond})`,
          rows: sourceRows.length,
          cost: (sourceRows.length * 0.15).toFixed(1)
        });
      }

      // 3. ORDER BY
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
          detail: `Sort: ${orderCol} ${orderDir}`,
          rows: sourceRows.length,
          cost: (sourceRows.length * 0.08).toFixed(1)
        });
      }

      // 4. LIMIT
      const limitMatch = remainingClauses.match(/LIMIT\s+(\d+)/i);
      if (limitMatch) {
        const limitVal = parseInt(limitMatch[1], 10);
        sourceRows = sourceRows.slice(0, limitVal);
        planSteps.push({
          op: 'Limit',
          detail: `Limit: ${limitVal} rows`,
          rows: sourceRows.length,
          cost: '0.1'
        });
      }

      // 5. Projection & Column Types
      let outputColumns = [];
      let columnTypes = {};
      let outputRows = [];

      const tblCols = this.db.tables[primaryTable].columns;

      if (rawCols === '*') {
        if (sourceRows.length > 0) {
          outputColumns = Object.keys(sourceRows[0]);
        } else {
          outputColumns = tblCols.map(c => c.name);
        }
        outputRows = sourceRows;
        outputColumns.forEach(cName => {
          const matched = tblCols.find(tc => tc.name === cName);
          columnTypes[cName] = matched ? matched.type : 'varchar';
        });
      } else {
        const reqCols = rawCols.split(',').map(c => c.trim());
        outputColumns = reqCols.map(c => {
          const m = c.match(/(?:AS\s+)?([a-zA-Z0-9_]+)$/i);
          return m ? m[1] : c;
        });

        outputRows = sourceRows.map(row => {
          const r = {};
          reqCols.forEach((colExpr, idx) => {
            const key = colExpr.split(/\s+AS\s+/i)[0].trim();
            const targetKey = outputColumns[idx];
            r[targetKey] = row[key] !== undefined ? row[key] : null;

            const matched = tblCols.find(tc => tc.name === key);
            columnTypes[targetKey] = matched ? matched.type : 'varchar';
          });
          return r;
        });
      }

      const durationMs = Number((performance.now() - startTime).toFixed(2));

      return {
        columns: outputColumns,
        columnTypes: columnTypes,
        rows: outputRows,
        executionTimeMs: durationMs,
        scannedRows: scannedCount,
        queryPlan: planSteps
      };
    }

    evaluateCondition(row, cond) {
      cond = cond.trim();

      if (/IS\s+NOT\s+NULL/i.test(cond)) {
        const col = cond.split(/IS\s+NOT\s+NULL/i)[0].trim();
        return row[col] !== null && row[col] !== undefined;
      }
      if (/IS\s+NULL/i.test(cond)) {
        const col = cond.split(/IS\s+NULL/i)[0].trim();
        return row[col] === null || row[col] === undefined;
      }

      const likeMatch = cond.match(/([a-zA-Z0-9_]+)\s+LIKE\s+['"]?([^'"]+)['"]?/i);
      if (likeMatch) {
        const col = likeMatch[1].trim();
        const pattern = likeMatch[2].replace(/%/g, '.*');
        return new RegExp(pattern, 'i').test(String(row[col] || ''));
      }

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
  // 4. NATURAL LANGUAGE AI COPILOT SYNTHESIZER
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

      // Check pre-seeded prompt matches
      for (const item of this.db.prompts || []) {
        if (p.includes(item.label.toLowerCase())) {
          return item.query;
        }
      }

      // Entity matching rules
      if (p.includes('top') && p.includes('org')) {
        return `SELECT org_id, name, tier, mrr, status FROM organizations ORDER BY mrr DESC LIMIT 5;`;
      }
      if (p.includes('enterprise') && p.includes('sub')) {
        return `SELECT sub_id, org_id, plan, seats, monthly_amount, status FROM subscriptions WHERE plan LIKE '%Enterprise%' ORDER BY monthly_amount DESC;`;
      }
      if (p.includes('admin') || p.includes('owner')) {
        return `SELECT user_id, email, role, last_login, is_active FROM users WHERE role IN ('admin', 'owner') ORDER BY last_login DESC;`;
      }
      if (p.includes('unpaid') || p.includes('invoice')) {
        return `SELECT invoice_id, org_id, amount, status, currency FROM invoices WHERE status = 'unpaid';`;
      }
      if (p.includes('high balance') || p.includes('account')) {
        return `SELECT account_id, holder_name, tier, balance, currency FROM accounts WHERE balance > 50000 ORDER BY balance DESC;`;
      }
      if (p.includes('flagged') || p.includes('fraud')) {
        return `SELECT txn_id, account_id, amount, txn_type, status FROM transactions WHERE status = 'FLAGGED';`;
      }
      if (p.includes('rating') || p.includes('product')) {
        return `SELECT product_id, title, category, price, rating FROM products WHERE rating > 4.6 ORDER BY rating DESC;`;
      }
      if (p.includes('vip') || p.includes('spend')) {
        return `SELECT customer_id, full_name, country, tier, total_spend FROM customers WHERE tier LIKE '%VIP%' ORDER BY total_spend DESC;`;
      }

      const firstTbl = Object.keys(this.db.tables)[0];
      return `SELECT * FROM ${firstTbl} LIMIT 15;`;
    }
  }

  const synthesizer = new NLSynthesizer(activeDb);

  // ============================================================================
  // 5. INTERACTIVE ERD SCHEMA ARCHITECT
  // ============================================================================
  class ErdVisualizer {
    constructor(canvas, db) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.db = db;
      this.nodes = [];
      this.links = [];
      this.scale = 1.0;
      this.panX = 50;
      this.panY = 50;
      this.draggingNode = null;
      this.dragOffset = { x: 0, y: 0 };
      this.isPanning = false;
      this.lastMouse = { x: 0, y: 0 };

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

      const colWidth = 230;
      let curX = 50;
      let curY = 50;

      tables.forEach((tblKey, idx) => {
        const tbl = this.db.tables[tblKey];
        const nodeHeight = 36 + tbl.columns.length * 20 + 8;

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

        curX += colWidth + 60;
        if (curX > 800) {
          curX = 50;
          curY += 240;
        }
      });

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
        const mx = (e.clientX - rect.left - this.panX) / this.scale;
        const my = (e.clientY - rect.top - this.panY) / this.scale;

        for (let i = this.nodes.length - 1; i >= 0; i--) {
          const n = this.nodes[i];
          if (mx >= n.x && mx <= n.x + n.width && my >= n.y && my <= n.y + n.height) {
            this.draggingNode = n;
            this.dragOffset.x = mx - n.x;
            this.dragOffset.y = my - n.y;
            audio.playClick();
            this.showTableDetailDrawer(n);
            return;
          }
        }

        this.isPanning = true;
        this.lastMouse.x = e.clientX;
        this.lastMouse.y = e.clientY;
      });

      window.addEventListener('mousemove', (e) => {
        if (this.draggingNode) {
          const rect = c.getBoundingClientRect();
          const mx = (e.clientX - rect.left - this.panX) / this.scale;
          const my = (e.clientY - rect.top - this.panY) / this.scale;
          this.draggingNode.x = mx - this.dragOffset.x;
          this.draggingNode.y = my - this.dragOffset.y;
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
        const factor = e.deltaY < 0 ? 1.06 : 0.94;
        this.scale = Math.min(Math.max(this.scale * factor, 0.4), 2.2);
        this.render();
      }, { passive: false });
    }

    render() {
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;

      ctx.clearRect(0, 0, w, h);

      ctx.save();
      ctx.fillStyle = '#07090e';
      ctx.fillRect(0, 0, w, h);

      ctx.translate(this.panX, this.panY);
      ctx.scale(this.scale, this.scale);

      // Dot Matrix Background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
      const step = 24;
      for (let x = -800; x < 2400; x += step) {
        for (let y = -800; y < 2400; y += step) {
          ctx.fillRect(x, y, 1.2, 1.2);
        }
      }

      // Draw Relationship Connectors
      this.links.forEach(l => {
        const src = this.nodes.find(n => n.id === l.sourceTable);
        const tgt = this.nodes.find(n => n.id === l.targetTable);

        if (src && tgt) {
          const sIdx = src.columns.findIndex(c => c.name === l.sourceCol);
          const tIdx = tgt.columns.findIndex(c => c.name === l.targetCol);

          const startX = src.x + src.width;
          const startY = src.y + 36 + (sIdx >= 0 ? sIdx : 0) * 20 + 10;
          const endX = tgt.x;
          const endY = tgt.y + 36 + (tIdx >= 0 ? tIdx : 0) * 20 + 10;

          const cp1x = startX + 40;
          const cp1y = startY;
          const cp2x = endX - 40;
          const cp2y = endY;

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.8;
          ctx.stroke();

          ctx.fillStyle = '#a855f7';
          ctx.beginPath();
          ctx.arc(startX, startY, 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(endX, endY, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw Tables
      this.nodes.forEach(n => {
        // Card Body
        ctx.fillStyle = '#10141d';
        ctx.strokeStyle = '#263145';
        ctx.lineWidth = 1.2;
        this.roundRect(ctx, n.x, n.y, n.width, n.height, 6, true, true);

        // Card Header
        ctx.fillStyle = '#171e2c';
        this.roundRect(ctx, n.x, n.y, n.width, 32, { tl: 6, tr: 6, bl: 0, br: 0 }, true, false);

        ctx.beginPath();
        ctx.moveTo(n.x, n.y + 32);
        ctx.lineTo(n.x + n.width, n.y + 32);
        ctx.strokeStyle = '#1c2331';
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11px "Fira Code", monospace';
        ctx.fillText(n.name, n.x + 10, n.y + 20);

        ctx.fillStyle = '#64748b';
        ctx.font = '10px "Inter", sans-serif';
        ctx.fillText(`${n.rowCount} rows`, n.x + n.width - 48, n.y + 20);

        // Columns
        n.columns.forEach((col, idx) => {
          const colY = n.y + 36 + idx * 20;

          if (col.isPk) {
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(n.x + 8, colY + 4, 16, 11);
            ctx.fillStyle = '#000';
            ctx.font = 'bold 8px monospace';
            ctx.fillText('PK', n.x + 10, colY + 12);
          } else if (col.isFk) {
            ctx.fillStyle = '#a855f7';
            ctx.fillRect(n.x + 8, colY + 4, 16, 11);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 8px monospace';
            ctx.fillText('FK', n.x + 10, colY + 12);
          } else {
            ctx.fillStyle = '#334155';
            ctx.beginPath();
            ctx.arc(n.x + 16, colY + 9, 2, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.fillStyle = '#cbd5e1';
          ctx.font = '10px "Fira Code", monospace';
          ctx.fillText(col.name, n.x + 30, colY + 13);

          ctx.fillStyle = '#64748b';
          ctx.font = '9px "Fira Code", monospace';
          ctx.fillText(col.type, n.x + n.width - 70, colY + 13);
        });
      });

      ctx.restore();
    }

    roundRect(ctx, x, y, width, height, radius, fill, stroke) {
      if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
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
      const drawer = document.getElementById('erd-entity-drawer');
      const title = document.getElementById('drawer-entity-name');
      const content = document.getElementById('drawer-entity-content');
      if (!drawer || !title || !content) return;

      title.textContent = `Table: ${node.name}`;
      let html = `<p style="margin-bottom: 6px;">Total Records: <strong>${node.rowCount}</strong></p>`;
      html += `<div style="font-weight: 600; margin-bottom: 4px; color: var(--text-muted);">Columns:</div>`;
      html += `<div style="display:flex; flex-direction:column; gap:4px;">`;
      node.columns.forEach(c => {
        html += `<div style="display:flex; justify-content:space-between; font-family:var(--font-mono); font-size:10px;">
          <span>${c.name} ${c.isPk ? '<span class="col-tag pk">PK</span>' : ''} ${c.isFk ? '<span class="col-tag fk">FK</span>' : ''}</span>
          <span style="color:var(--text-dim);">${c.type}</span>
        </div>`;
      });
      html += `</div>`;

      content.innerHTML = html;
      drawer.classList.remove('hidden');

      document.getElementById('btn-drawer-query-table').onclick = () => {
        setEditorContent(`SELECT * FROM ${node.name} LIMIT 20;`);
        switchResultView('view-grid');
        executeActiveQuery();
      };

      document.getElementById('btn-drawer-copy-name').onclick = () => {
        navigator.clipboard.writeText(node.name);
        audio.playClick();
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
      this.data = [];
      this.columns = [];
      this.palette = ['#38bdf8', '#a855f7', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];
    }

    setData(rows, columns) {
      this.data = rows;
      this.columns = columns;
      this.populateSelectors();
      this.render();
    }

    populateSelectors() {
      const selX = document.getElementById('chart-axis-x');
      const selY = document.getElementById('chart-axis-y');
      if (!selX || !selY) return;

      selX.innerHTML = '';
      selY.innerHTML = '';

      this.columns.forEach(col => {
        const ox = document.createElement('option');
        ox.value = col;
        ox.textContent = col;
        selX.appendChild(ox);

        const oy = document.createElement('option');
        oy.value = col;
        oy.textContent = col;
        selY.appendChild(oy);
      });

      this.xAxisCol = this.columns[0];
      const numericCol = this.columns.find(c => {
        return this.data.length && !isNaN(Number(this.data[0][c])) && typeof this.data[0][c] !== 'boolean';
      });
      this.yAxisCol = numericCol || (this.columns[1] || this.columns[0]);

      selX.value = this.xAxisCol;
      selY.value = this.yAxisCol;
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
        ctx.font = '13px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('No query rows available for plotting.', w / 2, h / 2);
        return;
      }

      const xLabels = this.data.map(r => String(r[this.xAxisCol] ?? ''));
      const yValues = this.data.map(r => Number(r[this.yAxisCol]) || 0);

      const maxVal = Math.max(...yValues, 1);
      const minVal = Math.min(...yValues, 0);

      // Update KPI strip
      const kpPoints = document.getElementById('kpi-total-points');
      const kpMax = document.getElementById('kpi-max-value');
      const kpMin = document.getElementById('kpi-min-value');
      const kpAvg = document.getElementById('kpi-avg-value');

      if (kpPoints) kpPoints.textContent = this.data.length;
      if (kpMax) kpMax.textContent = maxVal.toLocaleString();
      if (kpMin) kpMin.textContent = minVal.toLocaleString();
      if (kpAvg) {
        const sum = yValues.reduce((a, b) => a + b, 0);
        kpAvg.textContent = (sum / yValues.length).toFixed(1);
      }

      const pad = { top: 30, right: 30, bottom: 50, left: 60 };
      const cw = w - pad.left - pad.right;
      const ch = h - pad.top - pad.bottom;

      switch (this.chartType) {
        case 'bar':
          this.drawBar(ctx, xLabels, yValues, pad, cw, ch, maxVal);
          break;
        case 'line':
          this.drawLine(ctx, xLabels, yValues, pad, cw, ch, maxVal, false);
          break;
        case 'area':
          this.drawLine(ctx, xLabels, yValues, pad, cw, ch, maxVal, true);
          break;
        case 'donut':
          this.drawDonut(ctx, xLabels, yValues, w, h);
          break;
        case 'scatter':
          this.drawScatter(ctx, xLabels, yValues, pad, cw, ch, maxVal);
          break;
      }
    }

    drawBar(ctx, labels, values, pad, cw, ch, maxVal) {
      this.drawAxes(ctx, pad, cw, ch, maxVal);

      const gap = cw / values.length;
      const barW = Math.min(gap * 0.55, 48);

      values.forEach((v, idx) => {
        const barH = (v / maxVal) * ch;
        const x = pad.left + idx * gap + (gap - barW) / 2;
        const y = pad.top + ch - barH;

        const grad = ctx.createLinearGradient(0, y, 0, y + barH);
        grad.addColorStop(0, '#38bdf8');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0.2)');

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barW, barH);

        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x, y, barW, 2);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px "Inter", sans-serif';
        ctx.textAlign = 'center';
        const lbl = labels[idx].length > 9 ? labels[idx].slice(0, 7) + '..' : labels[idx];
        ctx.fillText(lbl, x + barW / 2, pad.top + ch + 18);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '9px "Fira Code", monospace';
        ctx.fillText(v.toLocaleString(), x + barW / 2, y - 5);
      });
    }

    drawLine(ctx, labels, values, pad, cw, ch, maxVal, isArea) {
      this.drawAxes(ctx, pad, cw, ch, maxVal);

      const step = cw / (values.length - 1 || 1);
      const pts = values.map((v, i) => ({
        x: pad.left + i * step,
        y: pad.top + ch - (v / maxVal) * ch
      }));

      if (isArea) {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pad.top + ch);
        pts.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(pts[pts.length - 1].x, pad.top + ch);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch);
        grad.addColorStop(0, 'rgba(168, 85, 247, 0.35)');
        grad.addColorStop(1, 'rgba(168, 85, 247, 0.0)');
        ctx.fillStyle = grad;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      pts.forEach((p, idx) => {
        ctx.fillStyle = '#0f131a';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px "Inter", sans-serif';
        ctx.textAlign = 'center';
        const lbl = labels[idx].length > 8 ? labels[idx].slice(0, 6) + '..' : labels[idx];
        ctx.fillText(lbl, p.x, pad.top + ch + 18);
      });
    }

    drawDonut(ctx, labels, values, w, h) {
      const cx = w / 2;
      const cy = h / 2;
      const rad = Math.min(w, h) * 0.32;
      const inRad = rad * 0.6;
      const total = values.reduce((a, b) => a + b, 0) || 1;

      let cur = -Math.PI / 2;

      values.forEach((v, idx) => {
        const slice = (v / total) * Math.PI * 2;
        const color = this.palette[idx % this.palette.length];

        ctx.beginPath();
        ctx.arc(cx, cy, rad, cur, cur + slice);
        ctx.arc(cx, cy, inRad, cur + slice, cur, true);
        ctx.closePath();

        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#07090e';
        ctx.lineWidth = 2;
        ctx.stroke();

        cur += slice;
      });

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 15px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Distribution', cx, cy - 4);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px "Fira Code", monospace';
      ctx.fillText(`${values.length} records`, cx, cy + 14);
    }

    drawScatter(ctx, labels, values, pad, cw, ch, maxVal) {
      this.drawAxes(ctx, pad, cw, ch, maxVal);

      values.forEach((v, idx) => {
        const x = pad.left + Math.random() * cw;
        const y = pad.top + ch - (v / maxVal) * ch;

        ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }

    drawAxes(ctx, pad, cw, ch, maxVal) {
      ctx.strokeStyle = '#1c2331';
      ctx.lineWidth = 1;

      const steps = 4;
      for (let i = 0; i <= steps; i++) {
        const y = pad.top + (ch / steps) * i;
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(pad.left + cw, y);
        ctx.stroke();

        const val = Math.round(maxVal - (maxVal / steps) * i);
        ctx.fillStyle = '#64748b';
        ctx.font = '9px "Fira Code", monospace';
        ctx.textAlign = 'right';
        ctx.fillText(val.toLocaleString(), pad.left - 8, y + 3);
      }

      ctx.beginPath();
      ctx.moveTo(pad.left, pad.top + ch);
      ctx.lineTo(pad.left + cw, pad.top + ch);
      ctx.strokeStyle = '#263145';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  // ============================================================================
  // 7. STUDIO CONTROLLER & UI SETUP
  // ============================================================================
  let erdVisualizer = null;
  let chartEngine = null;

  function initApp() {
    renderSidebarTree();
    renderPromptChips();
    updateLineNumbers();

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
    setupSplitResizer();

    // Execute Initial Query
    executeActiveQuery();
  }

  function setupEventListeners() {
    // Database Select
    const dbSelect = document.getElementById('db-select');
    if (dbSelect) {
      dbSelect.addEventListener('change', (e) => {
        currentDbKey = e.target.value;
        activeDb = JSON.parse(JSON.stringify(DATABASES[currentDbKey]));
        engine.setDatabase(activeDb);
        synthesizer.setDatabase(activeDb);
        if (erdVisualizer) erdVisualizer.setDatabase(activeDb);

        renderSidebarTree();
        renderPromptChips();

        const firstTbl = Object.keys(activeDb.tables)[0];
        document.getElementById('header-active-table').textContent = firstTbl;
        setEditorContent(`SELECT * FROM ${firstTbl} LIMIT 15;`);

        audio.playExecute();
        executeActiveQuery();
      });
    }

    // Run Query Button
    const btnRun = document.getElementById('btn-run-query');
    if (btnRun) btnRun.addEventListener('click', () => executeActiveQuery());

    // Format SQL Button
    const btnFormat = document.getElementById('btn-format-sql');
    if (btnFormat) {
      btnFormat.addEventListener('click', () => {
        const textarea = document.getElementById('sql-textarea');
        textarea.value = formatSql(textarea.value);
        updateLineNumbers();
        audio.playClick();
      });
    }

    // Clear SQL Button
    const btnClear = document.getElementById('btn-clear-sql');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        setEditorContent('');
        audio.playClick();
      });
    }

    // AI Copilot Toggle & Synthesis
    const btnAi = document.getElementById('btn-toggle-ai-copilot');
    const btnAiInline = document.getElementById('btn-open-copilot-inline');
    const copilotDrawer = document.getElementById('ai-copilot-drawer');
    const btnCloseCopilot = document.getElementById('btn-close-copilot');
    const btnCopilotGen = document.getElementById('btn-copilot-synthesize');
    const copilotInput = document.getElementById('copilot-nl-input');

    const toggleCopilot = () => {
      copilotDrawer.classList.toggle('hidden');
      if (!copilotDrawer.classList.contains('hidden')) {
        copilotInput.focus();
        audio.playClick();
      }
    };

    if (btnAi) btnAi.addEventListener('click', toggleCopilot);
    if (btnAiInline) btnAiInline.addEventListener('click', toggleCopilot);
    if (btnCloseCopilot) btnCloseCopilot.addEventListener('click', () => copilotDrawer.classList.add('hidden'));

    if (btnCopilotGen && copilotInput) {
      const handleGen = () => {
        const prompt = copilotInput.value.trim();
        if (!prompt) return;

        audio.playExecute();
        const synthesizedSql = synthesizer.synthesize(prompt);
        setEditorContent(synthesizedSql);
        copilotDrawer.classList.add('hidden');
        switchResultView('view-grid');
        executeActiveQuery();
      };

      btnCopilotGen.addEventListener('click', handleGen);
      copilotInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleGen();
        }
      });
    }

    // Editor Textarea Events
    const textarea = document.getElementById('sql-textarea');
    if (textarea) {
      textarea.addEventListener('input', () => {
        updateLineNumbers();
        saveActiveTabContent();
      });

      textarea.addEventListener('keyup', updateCursorPosition);
      textarea.addEventListener('click', updateCursorPosition);

      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + 2;
          updateLineNumbers();
        }
      });
    }

    // Results Tabs Navigation
    document.querySelectorAll('.res-tab').forEach(t => {
      t.addEventListener('click', () => {
        const viewId = t.getAttribute('data-res-view');
        switchResultView(viewId);
        audio.playClick();
      });
    });

    // Activity Dock Left Navigation
    document.querySelectorAll('.dock-btn[data-dock]').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.dock-btn').forEach(btn => btn.classList.remove('active'));
        b.classList.add('active');
        const dock = b.getAttribute('data-dock');

        if (dock === 'editor' || dock === 'tables') {
          switchResultView('view-grid');
        } else if (dock === 'erd') {
          switchResultView('view-erd');
        } else if (dock === 'analytics') {
          switchResultView('view-charts');
        } else if (dock === 'history') {
          switchResultView('view-history');
        }
        audio.playClick();
      });
    });

    // Quick Auto-Chart Button
    document.getElementById('btn-quick-chart').addEventListener('click', () => {
      switchResultView('view-charts');
      audio.playClick();
    });

    // Chart Type Selector
    document.querySelectorAll('#chart-type-selector .pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#chart-type-selector .pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (chartEngine) {
          chartEngine.setChartType(btn.getAttribute('data-type'));
          audio.playClick();
        }
      });
    });

    // Chart Axes Selectors
    document.getElementById('chart-axis-x').addEventListener('change', (e) => {
      if (chartEngine) {
        chartEngine.xAxisCol = e.target.value;
        chartEngine.render();
      }
    });

    document.getElementById('chart-axis-y').addEventListener('change', (e) => {
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

    document.getElementById('btn-erd-reset-fit').addEventListener('click', () => {
      if (erdVisualizer) {
        erdVisualizer.scale = 1.0;
        erdVisualizer.panX = 50;
        erdVisualizer.panY = 50;
        erdVisualizer.render();
        audio.playClick();
      }
    });

    document.getElementById('btn-erd-auto-layout').addEventListener('click', () => {
      if (erdVisualizer) {
        erdVisualizer.initNodes();
        erdVisualizer.render();
        audio.playExecute();
      }
    });

    document.getElementById('btn-close-entity-drawer').addEventListener('click', () => {
      document.getElementById('erd-entity-drawer').classList.add('hidden');
    });

    // Export Dropdown
    const btnExpDrop = document.getElementById('btn-export-dropdown');
    const expMenu = document.getElementById('export-menu');
    if (btnExpDrop && expMenu) {
      btnExpDrop.addEventListener('click', (e) => {
        e.stopPropagation();
        expMenu.classList.toggle('hidden');
      });
      window.addEventListener('click', () => expMenu.classList.add('hidden'));

      document.getElementById('opt-export-csv').addEventListener('click', exportCsv);
      document.getElementById('opt-export-json').addEventListener('click', exportJson);
      document.getElementById('opt-export-markdown').addEventListener('click', exportMarkdown);
      document.getElementById('opt-export-sql').addEventListener('click', exportSqlInserts);
    }

    // Modal DDL Dialog
    const btnDdl = document.getElementById('btn-schema-ddl');
    const ddlDialog = document.getElementById('ddl-dialog');
    if (btnDdl && ddlDialog) {
      btnDdl.addEventListener('click', () => {
        document.getElementById('ddl-code-display').textContent = generateDdl(activeDb);
        ddlDialog.showModal();
        audio.playClick();
      });
      document.getElementById('btn-close-ddl-x').addEventListener('click', () => ddlDialog.close());
      document.getElementById('btn-close-ddl-done').addEventListener('click', () => ddlDialog.close());
      document.getElementById('btn-copy-ddl-clipboard').addEventListener('click', () => {
        navigator.clipboard.writeText(generateDdl(activeDb));
        audio.playSuccess();
        alert('Database DDL copied to clipboard.');
      });
    }

    // Modal Shortcuts Dialog
    const btnShortcuts = document.getElementById('btn-help-shortcuts');
    const dockShortcuts = document.getElementById('dock-btn-shortcuts');
    const scDialog = document.getElementById('shortcuts-dialog');
    if (scDialog) {
      if (btnShortcuts) btnShortcuts.addEventListener('click', () => scDialog.showModal());
      if (dockShortcuts) dockShortcuts.addEventListener('click', () => scDialog.showModal());
      document.getElementById('btn-close-shortcuts-x').addEventListener('click', () => scDialog.close());
      document.getElementById('btn-close-shortcuts-done').addEventListener('click', () => scDialog.close());
    }

    // Audio Toggle
    const btnAudio = document.getElementById('btn-toggle-audio');
    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        audio.muted = !audio.muted;
        document.getElementById('audio-icon').textContent = audio.muted ? '🔇' : '🔊';
      });
    }

    // History Toggle & Clear
    const btnHist = document.getElementById('btn-toggle-history');
    if (btnHist) {
      btnHist.addEventListener('click', () => {
        switchResultView('view-history');
        audio.playClick();
      });
    }

    const btnClearHist = document.getElementById('btn-clear-history');
    if (btnClearHist) {
      btnClearHist.addEventListener('click', () => {
        queryHistory.length = 0;
        renderHistory();
        audio.playClick();
      });
    }

    // Client-side Grid Filter Search
    const gridSearch = document.getElementById('grid-filter-search');
    if (gridSearch) {
      gridSearch.addEventListener('input', (e) => {
        filterGridRows(e.target.value.toLowerCase());
      });
    }

    // Global Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        executeActiveQuery();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleCopilot();
      }
      if (e.key.toLowerCase() === 'm' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        audio.muted = !audio.muted;
        document.getElementById('audio-icon').textContent = audio.muted ? '🔇' : '🔊';
      }
      if (e.key === 'Escape') {
        const dialogs = document.querySelectorAll('dialog[open]');
        dialogs.forEach(d => d.close());
        document.getElementById('ai-copilot-drawer').classList.add('hidden');
        document.getElementById('erd-entity-drawer').classList.add('hidden');
      }
    });

    // Multi-tab Click Listener
    setupTabListeners();
  }

  function setupTabListeners() {
    document.querySelectorAll('.editor-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-close')) return;
        const tabId = tab.getAttribute('data-tab-id');
        switchQueryTab(tabId);
        audio.playClick();
      });
    });

    const btnNewTab = document.getElementById('btn-new-sql-tab');
    if (btnNewTab) {
      btnNewTab.addEventListener('click', () => {
        const newId = `tab-${queryTabs.length + 1}`;
        queryTabs.push({
          id: newId,
          title: `query_${queryTabs.length + 1}.sql`,
          content: 'SELECT * FROM organizations LIMIT 10;'
        });
        renderQueryTabs();
        switchQueryTab(newId);
        audio.playClick();
      });
    }
  }

  function renderQueryTabs() {
    const container = document.getElementById('editor-tabs-container');
    if (!container) return;
    container.innerHTML = '';

    queryTabs.forEach(t => {
      const btn = document.createElement('button');
      btn.className = `editor-tab ${t.id === activeTabId ? 'active' : ''}`;
      btn.setAttribute('data-tab-id', t.id);
      btn.innerHTML = `
        <span class="tab-indicator">●</span>
        <span class="tab-title">${t.title}</span>
        <span class="tab-close" title="Close Tab">✕</span>
      `;

      btn.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-close')) {
          e.stopPropagation();
          closeQueryTab(t.id);
          return;
        }
        switchQueryTab(t.id);
        audio.playClick();
      });

      container.appendChild(btn);
    });
  }

  function switchQueryTab(tabId) {
    saveActiveTabContent();
    activeTabId = tabId;
    const tab = queryTabs.find(t => t.id === tabId);
    if (tab) {
      const textarea = document.getElementById('sql-textarea');
      textarea.value = tab.content;
      updateLineNumbers();
      renderQueryTabs();
    }
  }

  function closeQueryTab(tabId) {
    if (queryTabs.length <= 1) return;
    const idx = queryTabs.findIndex(t => t.id === tabId);
    if (idx >= 0) {
      queryTabs.splice(idx, 1);
      if (activeTabId === tabId) {
        activeTabId = queryTabs[Math.max(0, idx - 1)].id;
      }
      renderQueryTabs();
      switchQueryTab(activeTabId);
    }
  }

  function saveActiveTabContent() {
    const tab = queryTabs.find(t => t.id === activeTabId);
    if (tab) {
      tab.content = document.getElementById('sql-textarea').value;
    }
  }

  function setEditorContent(sql) {
    const textarea = document.getElementById('sql-textarea');
    textarea.value = sql;
    updateLineNumbers();
    saveActiveTabContent();
  }

  function setupSplitResizer() {
    const splitter = document.getElementById('pane-splitter');
    const editorPane = document.getElementById('editor-pane');
    if (!splitter || !editorPane) return;

    let isResizing = false;

    splitter.addEventListener('mousedown', (e) => {
      isResizing = true;
      document.body.style.cursor = 'row-resize';
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const totalH = window.innerHeight - 72; // minus headers
      const newH = Math.max(140, Math.min(e.clientY - 46, totalH - 180));
      editorPane.style.flex = `0 0 ${newH}px`;
    });

    window.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = 'default';
        if (erdVisualizer) erdVisualizer.render();
        if (chartEngine) chartEngine.render();
      }
    });
  }

  function updateLineNumbers() {
    const textarea = document.getElementById('sql-textarea');
    const gutter = document.getElementById('line-gutter');
    if (!textarea || !gutter) return;

    const lineCount = textarea.value.split('\n').length;
    let linesHtml = '';
    for (let i = 1; i <= Math.max(lineCount, 3); i++) {
      linesHtml += `${i}<br>`;
    }
    gutter.innerHTML = linesHtml;
  }

  function updateCursorPosition() {
    const textarea = document.getElementById('sql-textarea');
    const display = document.getElementById('cursor-position-display');
    if (!textarea || !display) return;

    const textLines = textarea.value.substr(0, textarea.selectionStart).split('\n');
    const line = textLines.length;
    const col = textLines[textLines.length - 1].length + 1;
    display.textContent = `Ln ${line}, Col ${col}`;
  }

  function switchResultView(viewId) {
    currentResultView = viewId;
    document.querySelectorAll('.res-tab').forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-res-view') === viewId);
    });
    document.querySelectorAll('.res-view-panel').forEach(p => {
      p.classList.toggle('active', p.id === viewId);
    });

    if (viewId === 'view-erd' && erdVisualizer) {
      setTimeout(() => erdVisualizer.render(), 40);
    }
    if (viewId === 'view-charts' && chartEngine) {
      setTimeout(() => chartEngine.render(), 40);
    }
    if (viewId === 'view-history') {
      renderHistory();
    }
  }

  function executeActiveQuery() {
    const sql = document.getElementById('sql-textarea').value;
    const metricTime = document.getElementById('metric-query-time');
    const metricRows = document.getElementById('metric-rows-returned');
    const statusAnnounce = document.getElementById('global-status-announcement');
    const toast = document.getElementById('editor-toast-msg');

    try {
      const res = engine.execute(sql);
      currentQueryResult = res;

      metricTime.textContent = `${res.executionTimeMs}ms`;
      metricRows.textContent = `${res.rows.length} rows`;
      statusAnnounce.textContent = `Executed in ${res.executionTimeMs}ms (${res.rows.length} records)`;
      toast.textContent = `Query Success (${res.executionTimeMs}ms)`;

      document.getElementById('res-grid-count').textContent = res.rows.length;

      renderGridTable(res);
      renderExecutionPlan(res.queryPlan, res.executionTimeMs);

      if (chartEngine) {
        chartEngine.setData(res.rows, res.columns);
      }

      // Add to history
      queryHistory.unshift({
        sql: sql.trim(),
        duration: res.executionTimeMs,
        rows: res.rows.length,
        status: 'SUCCESS',
        time: new Date().toLocaleTimeString()
      });

      audio.playSuccess();
    } catch (err) {
      metricTime.textContent = '0ms';
      metricRows.textContent = '0 rows';
      statusAnnounce.textContent = `Error: ${err.message}`;
      toast.textContent = 'Syntax / Execution Error';

      const tbody = document.getElementById('grid-table-body');
      if (tbody) {
        tbody.innerHTML = `<tr><td colspan="12" style="color:var(--accent-rose); padding:16px;"><strong>Execution Error:</strong> ${err.message}</td></tr>`;
      }

      queryHistory.unshift({
        sql: sql.trim(),
        duration: 0,
        rows: 0,
        status: 'ERROR',
        time: new Date().toLocaleTimeString()
      });

      audio.playError();
    }
  }

  function renderGridTable(res) {
    const thead = document.getElementById('grid-table-head');
    const tbody = document.getElementById('grid-table-body');
    const emptyCard = document.getElementById('grid-empty-card');
    const pagSummary = document.getElementById('grid-pagination-summary');

    thead.innerHTML = '';
    tbody.innerHTML = '';

    if (!res.rows || res.rows.length === 0) {
      emptyCard.classList.remove('hidden');
      pagSummary.textContent = 'Showing 0 rows';
      return;
    }

    emptyCard.classList.add('hidden');
    pagSummary.textContent = `Showing 1–${res.rows.length} of ${res.rows.length} records`;

    // Header row with Row Index `#`
    const trHead = document.createElement('tr');
    const thIdx = document.createElement('th');
    thIdx.className = 'td-index';
    thIdx.textContent = '#';
    trHead.appendChild(thIdx);

    res.columns.forEach(col => {
      const th = document.createElement('th');
      const colType = res.columnTypes[col] || 'varchar';
      th.innerHTML = `
        <div class="th-content">
          <span>${col}</span>
          <span class="th-type-pill">${colType}</span>
        </div>
      `;
      th.addEventListener('click', () => sortGridBy(col));
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);

    // Body rows
    res.rows.forEach((row, idx) => {
      const tr = document.createElement('tr');

      const tdIdx = document.createElement('td');
      tdIdx.className = 'td-index';
      tdIdx.textContent = idx + 1;
      tr.appendChild(tdIdx);

      res.columns.forEach(col => {
        const td = document.createElement('td');
        const val = row[col];

        if (val === null || val === undefined) {
          td.innerHTML = `<span class="val-null">NULL</span>`;
        } else if (typeof val === 'boolean') {
          td.innerHTML = val ? `<span class="val-bool-true">true</span>` : `<span class="val-bool-false">false</span>`;
        } else {
          td.textContent = val;
        }

        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  function filterGridRows(query) {
    const rows = document.querySelectorAll('#grid-table-body tr');
    rows.forEach(r => {
      const text = r.textContent.toLowerCase();
      r.style.display = text.includes(query) ? '' : 'none';
    });
  }

  function sortGridBy(col) {
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

    renderGridTable(currentQueryResult);
    audio.playClick();
  }

  function renderExecutionPlan(plan, duration) {
    const container = document.getElementById('plan-nodes-container');
    if (!container) return;
    container.innerHTML = '';

    plan.forEach(step => {
      const div = document.createElement('div');
      div.className = 'plan-step-card';
      div.innerHTML = `
        <div>
          <span class="plan-step-title">${step.op}</span>
          <span class="plan-step-desc">${step.detail}</span>
        </div>
        <div style="text-align:right;">
          <span style="color:var(--accent-cyan); font-weight:700;">${step.rows} rows</span>
          <span style="color:var(--text-dim); margin-left:8px;">(cost: ${step.cost})</span>
        </div>
      `;
      container.appendChild(div);
    });
  }

  function renderHistory() {
    const list = document.getElementById('history-list-box');
    if (!list) return;
    list.innerHTML = '';

    if (queryHistory.length === 0) {
      list.innerHTML = `<div style="color:var(--text-dim); font-size:11px; padding:12px;">No executed queries recorded yet.</div>`;
      return;
    }

    queryHistory.forEach(h => {
      const div = document.createElement('div');
      div.className = 'history-row';
      div.innerHTML = `
        <span class="history-query-text" title="${h.sql}">${h.sql}</span>
        <div class="history-meta-box">
          <span class="hist-time">${h.duration}ms</span>
          <span style="color:var(--text-dim); font-size:9px;">${h.rows} rows</span>
          <span style="color:var(--text-dim); font-size:9px;">${h.time}</span>
          <button class="btn-hist-run">Load</button>
        </div>
      `;

      div.querySelector('.btn-hist-run').addEventListener('click', () => {
        setEditorContent(h.sql);
        switchResultView('view-grid');
        executeActiveQuery();
      });

      list.appendChild(div);
    });
  }

  function renderSidebarTree() {
    const tree = document.getElementById('explorer-tree');
    const badge = document.getElementById('sidebar-tables-badge');
    const fkCount = document.getElementById('explorer-fk-count');
    if (!tree) return;
    tree.innerHTML = '';

    const tables = Object.keys(activeDb.tables);
    if (badge) badge.textContent = tables.length;

    let totalFk = 0;

    tables.forEach(tblKey => {
      const tbl = activeDb.tables[tblKey];
      const node = document.createElement('div');
      node.className = 'tree-table-node';

      let colsHtml = '';
      tbl.columns.forEach(col => {
        if (col.isFk) totalFk++;
        colsHtml += `
          <div class="tree-col-row">
            <span>
              ${col.isPk ? '<span class="col-tag pk">PK</span>' : ''}
              ${col.isFk ? '<span class="col-tag fk">FK</span>' : ''}
              ${col.name}
            </span>
            <span class="tree-col-type">${col.type}</span>
          </div>
        `;
      });

      node.innerHTML = `
        <div class="tree-node-row">
          <div class="tree-node-left">
            <span class="tree-caret">▶</span>
            <span class="tree-tbl-name">${tblKey}</span>
          </div>
          <div class="tree-node-right">
            <span class="tree-row-count">${tbl.rows.length}</span>
            <button class="tree-quick-btn" title="SELECT * FROM table">⚡</button>
          </div>
        </div>
        <div class="tree-columns-box">${colsHtml}</div>
      `;

      node.querySelector('.tree-node-row').addEventListener('click', (e) => {
        if (e.target.classList.contains('tree-quick-btn')) return;
        node.classList.toggle('expanded');
        audio.playClick();
      });

      node.querySelector('.tree-quick-btn').addEventListener('click', () => {
        setEditorContent(`SELECT * FROM ${tblKey} LIMIT 20;`);
        switchResultView('view-grid');
        executeActiveQuery();
      });

      tree.appendChild(node);
    });

    if (fkCount) fkCount.textContent = `${totalFk} linked keys`;
  }

  function renderPromptChips() {
    const container = document.getElementById('copilot-prompt-chips');
    if (!container) return;
    container.innerHTML = '';

    (activeDb.prompts || []).forEach(p => {
      const chip = document.createElement('div');
      chip.className = 'chip-item';
      chip.textContent = p.label;
      chip.addEventListener('click', () => {
        setEditorContent(p.query);
        document.getElementById('ai-copilot-drawer').classList.add('hidden');
        switchResultView('view-grid');
        executeActiveQuery();
      });
      container.appendChild(chip);
    });
  }

  function formatSql(sql) {
    return sql
      .replace(/\s+/g, ' ')
      .replace(/\s*(SELECT|FROM|WHERE|JOIN|ON|ORDER BY|GROUP BY|LIMIT)\s*/gi, '\n$1 ')
      .trim();
  }

  function generateDdl(db) {
    let ddl = `-- NeuroQuery Studio Auto-Generated Schema DDL\n-- Dialect: ${db.dialect}\n\n`;
    Object.keys(db.tables).forEach(tKey => {
      const tbl = db.tables[tKey];
      ddl += `CREATE TABLE ${tKey} (\n`;
      const cols = tbl.columns.map(c => {
        let def = `  ${c.name.padEnd(16)} ${c.type}`;
        if (c.isPk) def += ' PRIMARY KEY';
        if (c.isFk && c.fkRef) def += ` REFERENCES ${c.fkRef.table}(${c.fkRef.col})`;
        return def;
      });
      ddl += cols.join(',\n') + '\n);\n\n';
    });
    return ddl;
  }

  function exportCsv() {
    if (!currentQueryResult || !currentQueryResult.rows.length) return;
    const cols = currentQueryResult.columns;
    const rows = [cols.join(',')];
    currentQueryResult.rows.forEach(r => {
      const row = cols.map(c => `"${String(r[c] ?? '').replace(/"/g, '""')}"`);
      rows.push(row.join(','));
    });
    downloadBlob(rows.join('\n'), 'neuroquery_export.csv', 'text/csv');
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
    alert('Results copied to clipboard as Markdown table!');
  }

  function exportSqlInserts() {
    if (!currentQueryResult || !currentQueryResult.rows.length) return;
    const cols = currentQueryResult.columns;
    const tbl = 'query_results';
    let sql = '';
    currentQueryResult.rows.forEach(r => {
      const vals = cols.map(c => {
        const v = r[c];
        return v === null ? 'NULL' : typeof v === 'number' ? v : `'${String(v).replace(/'/g, "''")}'`;
      });
      sql += `INSERT INTO ${tbl} (${cols.join(', ')}) VALUES (${vals.join(', ')});\n`;
    });
    navigator.clipboard.writeText(sql);
    audio.playSuccess();
    alert('SQL INSERT statements copied to clipboard!');
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
