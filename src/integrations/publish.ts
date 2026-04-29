/**
 * One-stop invoice publisher: pushes a freshly-created invoice through
 * every enabled provider (Frappe Sales Invoice → GST IRN → optional payment),
 * and updates the local invoice status accordingly.
 *
 * Pure function — UI calls this, no UI imports.
 */
import { storeApi } from "@/store/useStore";
import type { Invoice } from "@/data/mock";
import { integrationsApi, frappe, gst } from "@/integrations";
import type { FrappeConfig, GSTConfig } from "@/integrations/types";
import { toast } from "sonner";

export async function pushInvoiceToIntegrations(inv: Invoice) {
  const { config } = integrationsApi.getState();
  let allOk = true;

  // 1. Frappe — push Sales Invoice
  if (config.frappe?.enabled) {
    const cfg = config.frappe as FrappeConfig;
    const res = await frappe.pushSalesInvoice(inv, cfg);
    if (res.ok) {
      toast.success(`Synced to Frappe: ${res.remoteName}`, { duration: 2000 });
    } else {
      allOk = false;
      toast.error(`Frappe sync failed — ${res.error}`, { duration: 3000 });
    }
  }

  // 2. GST IRN (only if invoice has GST and provider enabled)
  if (config.gst?.enabled && (inv.items?.some((i) => i.gst > 0) ?? false)) {
    const cfg = config.gst as GSTConfig;
    const res = await gst.generateIRN(inv, cfg);
    if (res.ok) {
      toast.success(`IRN generated · ${res.irn?.slice(0, 12)}…`, { duration: 2000 });
    } else {
      allOk = false;
      toast.error(`IRN failed — ${res.error}`, { duration: 3000 });
    }
  }

  // 3. Push payment for non-udhar
  if (config.frappe?.enabled && inv.method !== "udhar") {
    const cfg = config.frappe as FrappeConfig;
    const res = await frappe.pushPayment(inv, cfg);
    if (!res.ok) {
      allOk = false;
      toast.error(`Payment Entry failed — ${res.error}`, { duration: 3000 });
    }
  }

  storeApi.setInvoiceStatus(inv.id, allOk ? "synced" : "failed");
}
