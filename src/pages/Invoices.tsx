import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { mockInvoices, formatINR } from "@/data/mock";
import { Search, AlertTriangle, RefreshCw, Plus, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const tabs = ["All", "Synced", "Pending", "Failed"] as const;
type Tab = typeof tabs[number];

const statusStyle: Record<string, string> = {
  synced:  "bg-success-soft text-success",
  pending: "bg-warning-soft text-warning",
  failed:  "bg-destructive/10 text-destructive",
};

const Invoices = () => {
  const [tab, setTab] = useState<Tab>("All");
  const [q, setQ] = useState("");

  const filtered = mockInvoices.filter((i) => {
    const matchTab = tab === "All" || i.status === tab.toLowerCase();
    const matchQ = !q || i.party.toLowerCase().includes(q.toLowerCase()) || i.number.toLowerCase().includes(q.toLowerCase());
    return matchTab && matchQ;
  });

  const failedCount = mockInvoices.filter((i) => i.status === "failed").length;

  return (
    <AppShell title="Invoices">
      <div className="px-4 lg:px-8 py-5 lg:py-8 max-w-7xl mx-auto space-y-4">
        {failedCount > 0 && (
          <div className="rounded-xl border border-warning/40 bg-warning-soft p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
            <div className="flex-1 text-sm">
              <span className="font-semibold text-warning">{failedCount} invoices failed to sync.</span>
              <span className="text-muted-foreground ml-1">Retry anytime — your data is safe.</span>
            </div>
            <Button size="sm" onClick={() => toast.success("Retrying sync…")}>
              <RefreshCw className="h-3.5 w-3.5" /> Retry all
            </Button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by party or invoice #"
              className="w-full h-11 rounded-xl border border-input bg-card pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button variant="outline" size="lg">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>

        <div className="flex gap-1 p-1 rounded-xl bg-secondary w-fit">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-base ${
                tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_1fr_120px_120px_100px] gap-4 px-5 py-3 border-b border-border bg-secondary/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Party</span><span>Invoice</span><span>Method</span><span className="text-right">Amount</span><span className="text-right">Status</span>
          </div>
          <ul className="divide-y divide-border">
            {filtered.length === 0 ? (
              <li className="p-12 text-center text-sm text-muted-foreground">No invoices match.</li>
            ) : filtered.map((inv) => (
              <li
                key={inv.id}
                className={`hover:bg-muted/40 transition-base ${inv.status === "failed" ? "bg-destructive/5" : ""}`}
              >
                <Link
                  to={`/invoices/${inv.id}`}
                  className="md:grid md:grid-cols-[1fr_1fr_120px_120px_100px] md:gap-4 md:items-center px-5 py-4 block"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-sm font-semibold">
                      {inv.party.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">{inv.party}</div>
                      <div className="text-xs text-muted-foreground md:hidden">{inv.number} • {inv.date}</div>
                    </div>
                  </div>
                  <div className="hidden md:block text-sm">
                    <div className="font-medium">{inv.number}</div>
                    <div className="text-xs text-muted-foreground">{inv.date}</div>
                  </div>
                  <div className="hidden md:block text-sm capitalize text-muted-foreground">{inv.method}</div>
                  <div className="md:text-right mt-2 md:mt-0 flex md:block justify-between items-center">
                    <span className="text-sm font-bold number-display">{formatINR(inv.amount)}</span>
                    <span className={`md:hidden ml-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusStyle[inv.status]}`}>
                      {inv.status}
                    </span>
                  </div>
                  <div className="hidden md:flex justify-end items-center gap-2">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${statusStyle[inv.status]}`}>
                      {inv.status}
                    </span>
                    {inv.status === "failed" && (
                      <button onClick={(e) => { e.preventDefault(); toast.success("Retrying…"); }} className="grid h-7 w-7 place-items-center rounded-md text-warning hover:bg-warning-soft">
                        <RefreshCw className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FAB */}
      <Link
        to="/pos"
        className="fixed bottom-24 right-5 lg:bottom-8 lg:right-8 z-30 grid h-14 w-14 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow hover:scale-110 transition-spring"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </AppShell>
  );
};

export default Invoices;
