import { useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Database, MessageCircle, IndianRupee, FileCheck2, Send, RefreshCw, CheckCircle2, AlertTriangle, Plug } from "lucide-react";
import { toast } from "sonner";
import { useIntegrations, integrationsApi, frappe } from "@/integrations";
import { storeApi } from "@/store/useStore";
import type { FrappeConfig, ProviderId, ProviderStatus } from "@/integrations/types";

const statusBadge: Record<ProviderStatus, string> = {
  disabled:   "bg-muted text-muted-foreground",
  configured: "bg-warning-soft text-warning",
  connected:  "bg-success-soft text-success",
  error:      "bg-destructive/10 text-destructive",
};

const Integrations = () => {
  const config = useIntegrations((s) => s.config);
  const health = useIntegrations((s) => s.health);

  return (
    <AppShell title="Integrations">
      <div className="px-4 lg:px-8 py-5 lg:py-8 max-w-3xl mx-auto space-y-5">
        <Link to="/settings" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Settings
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect Frappe / ERPNext, WhatsApp, UPI gateway, GST IRP and SMS. All values are stored locally for now — real network calls will be added when Lovable Cloud is enabled.
          </p>
        </div>

        <FrappeCard cfg={config.frappe} h={health.frappe} />
        <SimpleCard
          id="whatsapp" icon={MessageCircle} title="WhatsApp Business"
          desc="Real WhatsApp delivery (Meta Cloud API or Twilio)"
          enabled={!!config.whatsapp?.enabled} health={health.whatsapp}
          onToggle={(v) => integrationsApi.updateConfig("whatsapp", { enabled: v })}
        />
        <SimpleCard
          id="upi" icon={IndianRupee} title="UPI / Payment gateway"
          desc="Razorpay or Cashfree QR + payment webhooks"
          enabled={!!config.upi?.enabled} health={health.upi}
          onToggle={(v) => integrationsApi.updateConfig("upi", { enabled: v })}
        />
        <SimpleCard
          id="gst_irp" icon={FileCheck2} title="GST e-Invoice (NIC IRP)"
          desc="IRN + signed QR via your chosen GSP"
          enabled={!!config.gst?.enabled} health={health.gst_irp}
          onToggle={(v) => integrationsApi.updateConfig("gst", { enabled: v })}
        />
        <SimpleCard
          id="sms" icon={Send} title="SMS"
          desc="Payment reminders + OTP via Twilio / MSG91"
          enabled={!!config.sms?.enabled} health={health.sms}
          onToggle={(v) => integrationsApi.updateConfig("sms", { enabled: v })}
        />

        <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-4 text-xs text-muted-foreground">
          <Plug className="h-4 w-4 inline mr-1.5 text-primary" />
          Once Lovable Cloud is enabled, each adapter will be backed by an edge function so secrets never reach the browser.
        </div>
      </div>
    </AppShell>
  );
};

// ---------- Frappe (full form) ----------
const FrappeCard = ({ cfg, h }: { cfg: any; h: any }) => {
  const [draft, setDraft] = useState({
    baseUrl:        cfg?.baseUrl ?? "",
    apiKey:         cfg?.apiKey ?? "",
    apiSecret:      cfg?.apiSecret ?? "",
    defaultCompany: cfg?.defaultCompany ?? "",
    defaultWarehouse: cfg?.defaultWarehouse ?? "",
    placeOfSupply:  cfg?.placeOfSupply ?? "",
  });
  const [busy, setBusy] = useState<"test" | "pull" | null>(null);

  const save = () => {
    integrationsApi.updateConfig("frappe", { ...draft, enabled: !!cfg?.enabled });
    toast.success("Frappe config saved");
  };

  const test = async () => {
    setBusy("test");
    integrationsApi.updateConfig("frappe", draft);
    const res = await frappe.testConnection(draft as FrappeConfig);
    integrationsApi.setHealth("frappe", res);
    setBusy(null);
    if (res.status === "connected") toast.success(res.message ?? "Connected");
    else toast.error(res.message ?? "Failed");
  };

  const pullAll = async () => {
    setBusy("pull");
    const [items, customers] = await Promise.all([
      frappe.pullItems(draft as FrappeConfig),
      frappe.pullCustomers(draft as FrappeConfig),
    ]);
    storeApi.upsertProducts(items);
    storeApi.upsertParties(customers);
    setBusy(null);
    toast.success(`Pulled ${items.length} items, ${customers.length} customers`);
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-5 flex items-start gap-3 border-b border-border">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary">
          <Database className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-semibold">Frappe / ERPNext</h2>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusBadge[h.status as ProviderStatus]}`}>
              {h.status}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Push Sales Invoices · Payment Entries · Pull Items + Customers
          </p>
        </div>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!cfg?.enabled}
            onChange={(e) => integrationsApi.updateConfig("frappe", { enabled: e.target.checked })}
            className="h-5 w-5 accent-primary"
          />
        </label>
      </div>

      <div className="p-5 grid sm:grid-cols-2 gap-3">
        <Field label="Base URL" placeholder="http://localhost:8000" value={draft.baseUrl} onChange={(v) => setDraft({ ...draft, baseUrl: v })} />
        <Field label="Default Company" placeholder="Ravi Electronics" value={draft.defaultCompany} onChange={(v) => setDraft({ ...draft, defaultCompany: v })} />
        <Field label="API Key" value={draft.apiKey} onChange={(v) => setDraft({ ...draft, apiKey: v })} />
        <Field label="API Secret" type="password" value={draft.apiSecret} onChange={(v) => setDraft({ ...draft, apiSecret: v })} />
        <Field label="Default Warehouse" placeholder="Stores - RE" value={draft.defaultWarehouse} onChange={(v) => setDraft({ ...draft, defaultWarehouse: v })} />
        <Field label="Place of Supply" placeholder="27-Maharashtra" value={draft.placeOfSupply} onChange={(v) => setDraft({ ...draft, placeOfSupply: v })} />
      </div>

      <div className="px-5 pb-5 flex flex-wrap gap-2">
        <Button size="sm" onClick={save}>Save</Button>
        <Button size="sm" variant="outline" onClick={test} disabled={busy === "test"}>
          {busy === "test" ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
          Test connection
        </Button>
        <Button size="sm" variant="outline" onClick={pullAll} disabled={busy === "pull"}>
          {busy === "pull" ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          Pull masters
        </Button>
        {h.message && (
          <span className={`text-xs flex items-center gap-1 ml-1 ${h.status === "error" ? "text-destructive" : "text-muted-foreground"}`}>
            {h.status === "error" && <AlertTriangle className="h-3 w-3" />}
            {h.message}
          </span>
        )}
      </div>
    </div>
  );
};

// ---------- Simple toggle card ----------
const SimpleCard = ({
  id, icon: Icon, title, desc, enabled, health, onToggle,
}: {
  id: ProviderId; icon: any; title: string; desc: string;
  enabled: boolean; health: any; onToggle: (v: boolean) => void;
}) => (
  <div className="rounded-2xl border border-border bg-card p-5 flex items-start gap-3">
    <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary">
      <Icon className="h-5 w-5" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <h2 className="font-semibold">{title}</h2>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusBadge[health.status as ProviderStatus]}`}>
          {enabled ? health.status === "disabled" ? "configured" : health.status : "disabled"}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      <p className="text-[11px] text-muted-foreground mt-2">
        Full credential form available once <Link to="/settings" className="text-primary underline">Lovable Cloud</Link> is enabled.
      </p>
    </div>
    <input
      type="checkbox"
      checked={enabled}
      onChange={(e) => onToggle(e.target.checked)}
      className="h-5 w-5 accent-primary mt-1"
    />
  </div>
);

const Field = ({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) => (
  <label className="block">
    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-1 w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
    />
  </label>
);

export default Integrations;
