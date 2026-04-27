import { Clock, FileWarning, WifiOff, Receipt } from "lucide-react";

const problems = [
  { icon: Clock,      title: "Wasting 10 mins per bill",   desc: "Hand-written invoices, copying GST, calculator chaos." },
  { icon: FileWarning, title: "GST filing is a nightmare", desc: "Scattered receipts, missing invoices, last-minute panic." },
  { icon: WifiOff,    title: "Internet drops mid-sale",    desc: "Customer waiting, billing software stuck loading." },
  { icon: Receipt,    title: "Udhar piling up silently",   desc: "No idea who owes what, no easy way to remind." },
];

export const ProblemSection = () => (
  <section id="features" className="container py-20 lg:py-28">
    <div className="max-w-2xl">
      <div className="text-sm font-semibold text-primary uppercase tracking-wider">The problem</div>
      <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
        Billing shouldn't be the hardest part of your day.
      </h2>
    </div>
    <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {problems.map(({ icon: Icon, title, desc }) => (
        <div key={title} className="rounded-2xl border border-border bg-card p-6 hover:shadow-md transition-base">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-warning-soft text-warning">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-semibold">{title}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
        </div>
      ))}
    </div>
  </section>
);
