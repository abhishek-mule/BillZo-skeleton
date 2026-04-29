/**
 * Shared types for all third-party integrations.
 * The frontend talks to providers ONLY through these contracts; swapping a
 * stub for a real edge function is a one-file change in /integrations.
 */
import type { Invoice, Party, Product } from "@/data/mock";

export type ProviderId = "frappe" | "whatsapp" | "upi" | "gst_irp" | "sms";

export type ProviderStatus = "disabled" | "configured" | "connected" | "error";

export type ProviderHealth = {
  status: ProviderStatus;
  lastCheckedAt?: string;
  message?: string;
};

// ---------- Frappe / ERPNext ----------
export type FrappeConfig = {
  baseUrl: string;          // e.g. http://localhost:8000 or https://erp.mybiz.in
  apiKey: string;           // Frappe API key
  apiSecret: string;        // Frappe API secret
  defaultCompany: string;   // Required for Sales Invoice
  defaultWarehouse?: string;
  costCenter?: string;
  placeOfSupply?: string;   // e.g. "27-Maharashtra"
};

export type FrappePushResult = {
  ok: boolean;
  remoteName?: string;      // e.g. "ACC-SINV-2026-00034"
  error?: string;
  irn?: string;             // populated when GST/IRP is enabled
};

export interface FrappeAdapter {
  testConnection(cfg: FrappeConfig): Promise<ProviderHealth>;
  pushSalesInvoice(inv: Invoice, cfg: FrappeConfig): Promise<FrappePushResult>;
  pushPayment(inv: Invoice, cfg: FrappeConfig): Promise<FrappePushResult>;
  pullCustomers(cfg: FrappeConfig): Promise<Party[]>;
  pullItems(cfg: FrappeConfig): Promise<Product[]>;
}

// ---------- WhatsApp Business ----------
export type WhatsAppConfig = {
  provider: "meta_cloud" | "twilio";
  phoneNumberId?: string;   // Meta
  accessToken?: string;     // Meta
  twilioFrom?: string;      // Twilio WhatsApp-enabled number
  templateName?: string;    // e.g. "billzo_invoice_v1"
};

export interface WhatsAppAdapter {
  sendInvoice(
    to: string,
    inv: Invoice,
    cfg: WhatsAppConfig,
  ): Promise<{ ok: boolean; messageId?: string; error?: string }>;
}

// ---------- UPI / Payment gateway ----------
export type UPIConfig = {
  provider: "razorpay" | "cashfree";
  keyId?: string;
  webhookSecretConfigured?: boolean;
};

export interface UPIAdapter {
  createCollect(
    inv: Invoice,
    cfg: UPIConfig,
  ): Promise<{ ok: boolean; qrUrl?: string; orderId?: string; error?: string }>;
}

// ---------- GST e-Invoice (NIC IRP via GSP) ----------
export type GSTConfig = {
  gsp: "cleartax" | "mastersindia" | "irisgst";
  username?: string;
  gstin: string;
  ewbEnabled?: boolean;
};

export interface GSTAdapter {
  generateIRN(
    inv: Invoice,
    cfg: GSTConfig,
  ): Promise<{ ok: boolean; irn?: string; qrPayload?: string; ackNo?: string; error?: string }>;
}

// ---------- SMS ----------
export type SMSConfig = {
  provider: "twilio" | "msg91";
  fromOrSenderId?: string;
};

export interface SMSAdapter {
  sendReminder(
    to: string,
    body: string,
    cfg: SMSConfig,
  ): Promise<{ ok: boolean; sid?: string; error?: string }>;
}

// ---------- Combined integration config ----------
export type IntegrationsConfig = {
  frappe?: Partial<FrappeConfig> & { enabled?: boolean };
  whatsapp?: Partial<WhatsAppConfig> & { enabled?: boolean };
  upi?: Partial<UPIConfig> & { enabled?: boolean };
  gst?: Partial<GSTConfig> & { enabled?: boolean };
  sms?: Partial<SMSConfig> & { enabled?: boolean };
};
