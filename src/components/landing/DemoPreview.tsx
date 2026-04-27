import { Search, MessageCircle, CheckCircle2 } from "lucide-react";

export const DemoPreview = () => (
  <section id="demo" className="container py-20 lg:py-28">
    <div className="max-w-2xl mx-auto text-center">
      <div className="text-sm font-semibold text-primary uppercase tracking-wider">See it work</div>
      <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
        From product to paid in three taps.
      </h2>
    </div>

    <div className="mt-14 grid lg:grid-cols-3 gap-5">
      {/* Step 1 */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground">1</span>
          Search & add
        </div>
        <h3 className="mt-3 font-semibold">Instant product search</h3>
        <div className="mt-4 rounded-xl border border-border bg-background p-3">
          <div className="flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-2 text-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Parle</span>
          </div>
          <div className="mt-2 space-y-1.5">
            {["Parle-G 100g", "Parle Monaco", "Parle Hide & Seek"].map((p, i) => (
              <div key={p} className={`flex justify-between rounded-md px-3 py-2 text-sm ${i === 0 ? "bg-success-soft text-success font-medium" : "text-muted-foreground"}`}>
                <span>{p}</span>
                <span className="number-display">₹{[10, 15, 25][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground">2</span>
          Collect payment
        </div>
        <h3 className="mt-3 font-semibold">UPI · Cash · Udhar</h3>
        <div className="mt-4 space-y-2">
          {[
            { t: "UPI", a: "₹4,200", active: true },
            { t: "Cash", a: "—" },
            { t: "Udhar (Credit)", a: "—" },
          ].map((m) => (
            <div key={m.t} className={`flex items-center justify-between rounded-lg border p-3 text-sm ${m.active ? "border-success bg-success-soft text-success font-semibold" : "border-border"}`}>
              <span>{m.t}</span>
              <span className="number-display">{m.a}</span>
            </div>
          ))}
        </div>
        <button className="mt-3 w-full rounded-lg bg-gradient-primary text-primary-foreground py-2.5 text-sm font-semibold shadow-glow">
          Generate & Send
        </button>
      </div>

      {/* Step 3 */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground">3</span>
          Sent + synced
        </div>
        <h3 className="mt-3 font-semibold">Customer notified instantly</h3>
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center gap-3 rounded-lg bg-success-soft p-3 text-success">
            <CheckCircle2 className="h-5 w-5" />
            <div className="text-sm font-medium">Invoice INV-0034 created</div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-success-soft p-3 text-success">
            <MessageCircle className="h-5 w-5" />
            <div className="text-sm font-medium">Sent on WhatsApp</div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-success-soft p-3 text-success">
            <CheckCircle2 className="h-5 w-5" />
            <div className="text-sm font-medium">Synced to cloud</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
