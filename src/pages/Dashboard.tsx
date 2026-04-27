import { Link } from "react-router-dom";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { todayStats, mockInvoices, formatINR } from "@/data/mock";
import { Plus, ScanLine, Package, Users, AlertTriangle, CheckCircle2, ArrowRight, TrendingUp } from "lucide-react";

const statusBadge: Record<string, string> = {
  synced:  "bg-success-soft text-success",
  pending: "bg-warning-soft text-warning",
  failed:  "bg-destructive/10 text-destructive",
};

const Dashboard = () => {
  const allSynced = todayStats.failedCount === 0;
  return (
    <AppShell title="Home">
      <div className="px-4 lg:px-8 py-5 lg:py-8 max-w-7xl mx-auto space-y-5">
        {/* Revenue hero card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-card text-primary-foreground p-6 lg:p-8 shadow-elegant">
          <div className="absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,hsl(var(--success)),transparent_50%)]" />
          </div>
          <div className="relative">
            <div className="text-sm opacity-80">Today's revenue</div>
            <div className="mt-2 text-5xl lg:text-6xl font-bold number-display tracking-tight">
              {formatINR(todayStats.revenue)}
            </div>
            <div className="mt-3 flex items-center gap-4 text-sm opacity-90">
              <span>{todayStats.invoiceCount} invoices</span>
              <span className="opacity-50">•</span>
              <span className="inline-flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" /> +18% vs yesterday</span>
            </div>
          </div>
        </div>

        {/* Sync status */}
        <div className={`rounded-2xl border p-5 flex items-center gap-4 ${allSynced ? "border-success/30 bg-success-soft" : "border-warning/40 bg-warning-soft"}`}>
          <div className={`grid h-11 w-11 place-items-center rounded-xl ${allSynced ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}`}>
            {allSynced ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-semibold ${allSynced ? "text-success" : "text-warning"}`}>
              {allSynced ? "All invoices synced" : `${todayStats.failedCount} invoices failed to sync`}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {allSynced ? "Last synced just now" : "Tap retry to send them again"}
            </div>
          </div>
          {!allSynced && <Button variant="default" size="sm">Retry</Button>}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { to: "/pos",       label: "Bill",      icon: Plus, primary: true },
            { to: "/purchases", label: "Scan",      icon: ScanLine },
            { to: "/products",  label: "Products",  icon: Package },
            { to: "/parties",   label: "Parties",   icon: Users },
          ].map(({ to, label, icon: Icon, primary }) => (
            <Link
              key={label}
              to={to}
              className={`rounded-2xl p-4 flex flex-col items-center gap-2 border transition-spring active:scale-95 ${
                primary
                  ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow"
                  : "bg-card border-border hover:border-primary/30 hover:shadow-md"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-semibold">{label}</span>
            </Link>
          ))}
        </div>

        {/* Recent invoices */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold">Recent invoices</h2>
            <Link to="/invoices" className="text-xs text-primary font-medium inline-flex items-center gap-1 hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {mockInvoices.slice(0, 6).map((inv) => (
              <li key={inv.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 transition-base">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-sm font-semibold">
                  {inv.party.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{inv.party}</div>
                  <div className="text-xs text-muted-foreground">{inv.number} • {inv.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold number-display">{formatINR(inv.amount)}</div>
                  <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusBadge[inv.status]}`}>
                    {inv.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
