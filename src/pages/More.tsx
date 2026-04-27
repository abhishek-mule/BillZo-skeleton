import { AppShell } from "@/components/app/AppShell";
import { Link } from "react-router-dom";
import { ShoppingBag, Users, BarChart3, Settings as SettingsIcon, ChevronRight } from "lucide-react";

const items = [
  { to: "/purchases", label: "Purchases", icon: ShoppingBag, desc: "Scan supplier invoices" },
  { to: "/parties",   label: "Parties",   icon: Users,       desc: "Customers & suppliers" },
  { to: "/reports",   label: "Reports",   icon: BarChart3,   desc: "GST & sales" },
  { to: "/settings",  label: "Settings",  icon: SettingsIcon, desc: "Shop, users, security" },
];

const More = () => (
  <AppShell title="More">
    <div className="px-4 py-5 max-w-md mx-auto space-y-2">
      {items.map(({ to, label, icon: Icon, desc }) => (
        <Link key={to} to={to} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3 hover:border-primary/30 transition-base">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold">{label}</div>
            <div className="text-xs text-muted-foreground">{desc}</div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      ))}
    </div>
  </AppShell>
);

export default More;
