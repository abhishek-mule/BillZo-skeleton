import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, MessageCircle, Zap } from "lucide-react";

export const HeroSection = () => (
  <section className="relative overflow-hidden bg-gradient-hero">
    <div className="absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary-glow)/0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,hsl(var(--success)/0.12),transparent_50%)]" />
    </div>

    <div className="container py-16 lg:py-24">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Zap className="h-3 w-3 text-primary" />
            Built for Indian shopkeepers
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
            Create GST bill in{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">20 seconds.</span>
            <br />
            Send on WhatsApp instantly.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-xl">
            BillZo is the fastest way for shops, kirana, and small businesses to
            bill, sync, and get paid — right from your phone.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button asChild variant="hero" size="xl">
              <Link to="/auth">Start Free <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link to="/dashboard">Try Demo</Link>
            </Button>
          </div>

          <div className="mt-8 inline-flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-success-soft">
              <Check className="h-4 w-4 text-success" />
            </div>
            <div>
              <div className="text-sm font-semibold number-display">₹28,450 billed today</div>
              <div className="text-xs text-success">All synced ✓</div>
            </div>
          </div>
        </div>

        {/* Phone mockup */}
        <div className="relative mx-auto w-full max-w-sm lg:max-w-md animate-scale-in">
          <div className="relative rounded-[2.5rem] border-8 border-foreground/90 bg-foreground/90 shadow-elegant overflow-hidden">
            <div className="bg-card rounded-[1.75rem] overflow-hidden">
              {/* fake POS preview */}
              <div className="bg-gradient-primary px-5 pt-6 pb-12 text-primary-foreground">
                <div className="flex justify-between items-center text-xs opacity-80">
                  <span>Ravi Electronics</span>
                  <span>● Online</span>
                </div>
                <div className="mt-4">
                  <div className="text-xs opacity-70">Today's revenue</div>
                  <div className="text-3xl font-bold number-display mt-1">₹28,450</div>
                  <div className="text-xs opacity-80 mt-1">34 invoices • All synced</div>
                </div>
              </div>
              <div className="-mt-6 mx-4 rounded-xl bg-card border border-border shadow-md p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-success text-success-foreground">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">Invoice sent</div>
                    <div className="text-xs text-muted-foreground truncate">to Anjali Sharma on WhatsApp</div>
                  </div>
                  <div className="text-sm font-semibold number-display">₹4,200</div>
                </div>
                {[
                  { n: "Rahul Mehta", a: 1850 },
                  { n: "Walk-in", a: 320 },
                  { n: "Kumar General", a: 870 },
                ].map((r) => (
                  <div key={r.n} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{r.n}</span>
                    <span className="font-medium number-display">₹{r.a.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
              <div className="px-4 py-5 grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                {["Home", "Bills", "POS", "Stock"].map((l, i) => (
                  <div key={l} className={`flex flex-col items-center gap-1 ${i === 2 ? "text-primary font-semibold" : ""}`}>
                    <div className={`h-7 w-7 rounded-lg ${i === 2 ? "bg-gradient-primary" : "bg-muted"}`} />
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 rounded-xl bg-card border border-border shadow-lg px-3 py-2 text-xs font-medium animate-fade-in">
            <span className="text-success">●</span> Synced in 0.3s
          </div>
        </div>
      </div>
    </div>
  </section>
);
