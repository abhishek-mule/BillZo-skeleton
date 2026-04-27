import { AppShell } from "@/components/app/AppShell";
import { Store, Receipt, MessageCircle, Users, Shield, ChevronRight, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

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

const Settings = () => (
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

export default Settings;
