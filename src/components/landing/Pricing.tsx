import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "Free",
    sub: "forever",
    features: ["Up to 50 invoices/month", "WhatsApp delivery", "GST reports", "1 user"],
    cta: "Start Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹299",
    sub: "/month",
    features: ["Unlimited invoices", "Multi-device sync", "Purchase OCR", "Up to 3 users", "Priority support"],
    cta: "Start 14-day trial",
    highlight: true,
  },
  {
    name: "Business",
    price: "₹799",
    sub: "/month",
    features: ["Everything in Pro", "Unlimited users", "Multi-shop", "API access", "Dedicated CA export"],
    cta: "Talk to sales",
    highlight: false,
  },
];

export const Pricing = () => (
  <section id="pricing" className="bg-secondary/40 border-y border-border">
    <div className="container py-20 lg:py-28">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-sm font-semibold text-primary uppercase tracking-wider">Pricing</div>
        <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
          Simple pricing. No GST surprises.
        </h2>
        <p className="mt-3 text-muted-foreground">Start free. Upgrade when you outgrow it.</p>
      </div>
      <div className="mt-12 grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`relative rounded-2xl border p-7 ${
              t.highlight
                ? "border-primary bg-gradient-card text-primary-foreground shadow-elegant"
                : "border-border bg-card"
            }`}
          >
            {t.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-success text-success-foreground px-3 py-1 text-xs font-semibold shadow-success">
                Most Popular
              </div>
            )}
            <div className="text-sm font-semibold">{t.name}</div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-bold number-display">{t.price}</span>
              <span className={`text-sm ${t.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{t.sub}</span>
            </div>
            <ul className="mt-6 space-y-3">
              {t.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className={`h-4 w-4 ${t.highlight ? "text-success-foreground bg-success/40 rounded-full p-0.5" : "text-success"}`} />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              asChild
              variant={t.highlight ? "success" : "outline"}
              size="lg"
              className="mt-7 w-full"
            >
              <Link to="/auth">{t.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  </section>
);
