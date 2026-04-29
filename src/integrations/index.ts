/**
 * Public façade. UI imports from here, not from /stubs directly.
 * When you wire real Lovable Cloud edge functions later, swap these
 * exports for the real adapters and nothing else changes.
 */
export * from "./types";
export { useIntegrations, integrationsApi } from "./store";
export {
  frappeStub as frappe,
  whatsappStub as whatsapp,
  upiStub as upi,
  gstStub as gst,
  smsStub as sms,
} from "./stubs";
