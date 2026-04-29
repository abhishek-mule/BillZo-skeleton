import { AppShell } from "@/components/app/AppShell";
import { Store, Receipt, MessageCircle, Users, Shield, ChevronRight, LogOut, Printer, Send, RotateCcw, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { usePrefs, type DefaultDeliveryAction, type PrintFormat } from "@/hooks/usePrefs";
import { storeApi } from "@/store/useStore";
import { toast } from "sonner";

const groups = [
  { title: "Business", items: [
    { icon: Store,         label: "Profile",     desc: "Shop name, address, logo" },
    { icon: Receipt,       label: "GST",         desc: "GSTIN, invoice format, HSN" },
    { icon: MessageCircle, label: "WhatsApp",    desc: "Sender number, templates" },
  ]},
  { title: "Account", items: [
    { icon: Users,  label: "Users & roles", desc: "Manage staff access" },
    { icon: Shield, label: "Security",      desc: "PIN, 2FA, session devices" },
  ]},
];

const Settings = () => {
  const { prefs, update } = usePrefs();

  const actionOpts: { key: DefaultDeliveryAction; label: string }[] = [
    { key: "whatsapp", label: "Send WhatsApp" },
    { key: "print", label: "Print" },
    { key: "ask", label: "Ask every time" },
  ];
  const formatOpts: { key: PrintFormat; label: string }[] = [
    { key: "thermal80", label: "Thermal 80mm" },
    { key: "thermal58", label: "Thermal 58mm" },
    { key: "a4", label: "A4" },
  ];

  return (
    <AppShell title="Settings">
      <div className="px-4 lg:px-8 py-5 lg:py-8 max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-primary text-primary-foreground text-xl font-bold">R</div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold">Ravi Electronics</div>
            <div className="text-xs text-muted-foreground">+91 98765 43210 · Pro plan</div>
          </div>
          <span className="rounded-full bg-success-soft text-success text-xs font-semibold px-2.5 py-1">Active</span>
        </div>

        {/* Delivery & Print preferences */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            Delivery & Print
          </div>
          <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary">
                  <Send className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">Default action after billing</div>
                  <div className="text-xs text-muted-foreground">What happens the moment a sale is done</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {actionOpts.map((o) => (
                  <button
                    key={o.key}
                    onClick={() => update("defaultAction", o.key)}
                    className={`rounded-lg border-2 px-3 py-2 text-xs font-medium transition-base ${
                      prefs.defaultAction === o.key ? "border-primary bg-primary/5 text-primary" : "border-input hover:border-primary/40"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary">
                  <Printer className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">Default print format</div>
                  <div className="text-xs text-muted-foreground">Used for auto-print and quick print</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {formatOpts.map((o) => (
                  <button
                    key={o.key}
                    onClick={() => update("printFormat", o.key)}
                    className={`rounded-lg border-2 px-3 py-2 text-xs font-medium transition-base ${
                      prefs.printFormat === o.key ? "border-primary bg-primary/5 text-primary" : "border-input hover:border-primary/40"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="p-4 flex items-center gap-3 cursor-pointer hover:bg-muted/40">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary">
                <Printer className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">Auto-print after billing</div>
                <div className="text-xs text-muted-foreground">Triggers print dialog on sale completion</div>
              </div>
              <input
                type="checkbox"
                checked={prefs.autoPrint}
                onChange={(e) => update("autoPrint", e.target.checked)}
                className="h-5 w-5 accent-primary"
              />
            </label>
          </div>
        </div>

        {groups.map((g) => (
          <div key={g.title}>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">{g.title}</div>
            <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
              {g.items.map(({ icon: Icon, label, desc }) => (
                <button key={label} className="w-full p-4 flex items-center gap-3 hover:bg-muted/40 transition-base text-left">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{label}</div>
                    <div className="text-xs text-muted-foreground">{desc}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ))}

        <Link to="/" className="w-full rounded-2xl border border-destructive/30 bg-destructive/5 p-4 flex items-center justify-center gap-2 text-destructive font-medium hover:bg-destructive/10 transition-base">
          <LogOut className="h-4 w-4" /> Sign out
        </Link>
      </div>
    </AppShell>
  );
};

export default Settings;
