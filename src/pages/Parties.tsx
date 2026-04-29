import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/data/mock";
import { useStore, storeApi } from "@/store/useStore";
import { Search, MessageCircle, Phone, Plus, Check } from "lucide-react";
import { toast } from "sonner";

const Parties = () => {
  const [q, setQ] = useState("");
  const parties = useStore((s) => s.parties);
  const totalPending = parties.reduce((s, p) => s + p.pending, 0);
  const filtered = parties.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <AppShell title="Parties">
      <div className="px-4 lg:px-8 py-5 lg:py-8 max-w-4xl mx-auto space-y-4">
        {/* Pending summary */}
        <div className="rounded-2xl bg-gradient-card text-primary-foreground p-6 shadow-elegant">
          <div className="text-sm opacity-80">Total pending (Udhar)</div>
          <div className="mt-2 text-4xl font-bold number-display">{formatINR(totalPending)}</div>
          <div className="mt-2 text-xs opacity-80">{parties.filter((p) => p.pending > 0).length} parties owe you money</div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search parties"
              className="w-full h-11 rounded-xl border border-input bg-card pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button variant="hero" size="lg">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
          {filtered.map((p) => (
            <div key={p.id} className="p-4 flex items-center gap-3">
              <div className={`grid h-11 w-11 place-items-center rounded-full font-semibold text-sm ${
                p.pending > 0 ? "bg-warning-soft text-warning" : "bg-secondary text-muted-foreground"
              }`}>
                {p.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Phone className="h-3 w-3" /> {p.phone}
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary">{p.type}</span>
                </div>
              </div>
              <div className="text-right">
                {p.pending > 0 ? (
                  <>
                    <div className="text-sm font-bold text-warning number-display">{formatINR(p.pending)}</div>
                    <div className="text-[10px] text-muted-foreground">pending</div>
                  </>
                ) : (
                  <span className="text-xs text-success font-medium">Settled ✓</span>
                )}
              </div>
              {p.pending > 0 && (
                <div className="flex flex-col gap-1.5">
                  <Button
                    size="sm"
                    variant="soft"
                    onClick={() => toast.success(`Reminder sent to ${p.name} on WhatsApp`)}
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> Remind
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => { storeApi.markPartyPaid(p.id); toast.success(`${p.name} marked paid`); }}
                  >
                    <Check className="h-3.5 w-3.5" /> Paid
                  </Button>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-12 text-center text-sm text-muted-foreground">No parties match.</div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default Parties;
