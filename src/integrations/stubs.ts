/**
 * Stub adapter implementations. They simulate latency + occasional failures
 * so the UI behaves like a real integration. Replace each method with an
 * `await fetch("/functions/v1/...")` call once Lovable Cloud is enabled.
 */
import type {
  FrappeAdapter, FrappeConfig, FrappePushResult,
  WhatsAppAdapter, WhatsAppConfig,
  UPIAdapter, UPIConfig,
  GSTAdapter, GSTConfig,
  SMSAdapter, SMSConfig,
  ProviderHealth,
} from "./types";
import type { Invoice, Party, Product } from "@/data/mock";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const flaky = (rate = 0.08) => Math.random() < rate;
const id = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const requireFields = <T extends object>(cfg: T, keys: (keyof T)[]) =>
  keys.every((k) => !!cfg[k]);

// ============ Frappe / ERPNext ============
export const frappeStub: FrappeAdapter = {
  async testConnection(cfg: FrappeConfig): Promise<ProviderHealth> {
    await wait(700);
    if (!requireFields(cfg, ["baseUrl", "apiKey", "apiSecret", "defaultCompany"])) {
      return { status: "error", message: "Missing required fields", lastCheckedAt: new Date().toISOString() };
    }
    if (flaky(0.05)) return { status: "error", message: "401 Unauthorized (stub)", lastCheckedAt: new Date().toISOString() };
    return { status: "connected", message: `Reached ${cfg.baseUrl}`, lastCheckedAt: new Date().toISOString() };
  },

  async pushSalesInvoice(inv, cfg): Promise<FrappePushResult> {
    await wait(900 + Math.random() * 600);
    if (flaky(0.1)) return { ok: false, error: "Frappe responded 500 (stub) — queued for retry" };
    return {
      ok: true,
      remoteName: `ACC-SINV-${new Date().getFullYear()}-${inv.number.replace(/\D/g, "")}`,
    };
  },

  async pushPayment(inv, cfg): Promise<FrappePushResult> {
    await wait(600);
    if (flaky(0.07)) return { ok: false, error: "Payment Entry rejected (stub)" };
    return { ok: true, remoteName: `ACC-PAY-${id("p")}` };
  },

  async pullCustomers(_cfg): Promise<Party[]> {
    await wait(800);
    return [
      { id: id("c"), name: "Krishna Stores",   phone: "919812000001", pending: 0, type: "customer" },
      { id: id("c"), name: "MG Road Kirana",   phone: "919812000002", pending: 0, type: "customer" },
      { id: id("c"), name: "Sai Provisions",   phone: "919812000003", pending: 0, type: "customer" },
    ];
  },

  async pullItems(_cfg): Promise<Product[]> {
    await wait(800);
    return [
      { id: id("p"), name: "Fortune Sunflower Oil 1L", price: 175, stock: 40, unit: "pc", hsn: "1512", gst: 5,  barcode: "8901999100013" },
      { id: id("p"), name: "Nescafe Classic 50g",     price: 220, stock: 28, unit: "pc", hsn: "2101", gst: 18, barcode: "8901999100020" },
    ];
  },
};

// ============ WhatsApp Business ============
export const whatsappStub: WhatsAppAdapter = {
  async sendInvoice(to, inv, cfg) {
    await wait(800);
    if (!cfg.provider) return { ok: false, error: "WhatsApp provider not configured" };
    if (!to) return { ok: false, error: "No recipient phone" };
    if (flaky(0.08)) return { ok: false, error: "Template not approved (stub)" };
    return { ok: true, messageId: `wa-${id("msg")}` };
  },
};

// ============ UPI / Payment gateway ============
export const upiStub: UPIAdapter = {
  async createCollect(inv, cfg) {
    await wait(700);
    if (!cfg.provider || !cfg.keyId) return { ok: false, error: "UPI gateway not configured" };
    return {
      ok: true,
      orderId: `${cfg.provider}_${id("ord")}`,
      qrUrl: `upi://pay?pa=billzo@stub&pn=BillZo&am=${inv.amount}&tn=${inv.number}`,
    };
  },
};

// ============ GST e-Invoice ============
export const gstStub: GSTAdapter = {
  async generateIRN(inv, cfg) {
    await wait(1100);
    if (!cfg.gstin) return { ok: false, error: "GSTIN not configured" };
    if (inv.amount < 0) return { ok: false, error: "Negative amount not allowed" };
    return {
      ok: true,
      irn: `${id("irn")}${id("irn")}`.replace(/-/g, "").slice(0, 64),
      ackNo: id("ack"),
      qrPayload: "stub-qr-payload",
    };
  },
};

// ============ SMS ============
export const smsStub: SMSAdapter = {
  async sendReminder(to, body, cfg) {
    await wait(500);
    if (!cfg.provider || !cfg.fromOrSenderId) return { ok: false, error: "SMS provider not configured" };
    if (!to) return { ok: false, error: "No recipient" };
    return { ok: true, sid: `sms-${id("s")}` };
  },
};
