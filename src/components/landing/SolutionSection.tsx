import { Zap, MessageCircle, ShieldCheck, Smartphone } from "lucide-react";

const solutions = [
  { icon: Zap,           title: "20-second invoice",     desc: "Search product, tap quantity, done. Built for speed first." },
  { icon: MessageCircle, title: "WhatsApp delivery",     desc: "Customer gets invoice + payment link instantly on WhatsApp." },
  { icon: ShieldCheck,   title: "GST-ready always",      desc: "HSN, GSTIN, tax — auto. CA gets a clean export every month." },
  { icon: Smartphone,    title: "Works offline",         desc: "POS works without internet. Syncs when you're back online." },
];

export const SolutionSection = () => (
  <section className="bg-secondary/40 border-y border-border">
    <div className="container py-20 lg:py-28">
      <div className="max-w-2xl">
        <div className="text-sm font-semibold text-success uppercase tracking-wider">The fix</div>
        <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
          One app. Built around your shop, not your accountant.
        </h2>
      </div>
      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {solutions.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-2xl bg-card border border-border p-6 shadow-sm hover:shadow-glow hover:-translate-y-1 transition-spring">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold">{title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
