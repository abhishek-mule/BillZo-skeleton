import { Check } from "lucide-react";

const items = [
  "GST Ready",
  "WhatsApp Delivery",
  "Works with your CA",
  "No laptop needed",
];

export const ProofStrip = () => (
  <section className="border-y border-border bg-card">
    <div className="container py-6">
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {items.map((t) => (
          <div key={t} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-success-soft text-success">
              <Check className="h-3 w-3" />
            </span>
            {t}
          </div>
        ))}
      </div>
    </div>
  </section>
);
