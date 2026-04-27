import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTASection = () => (
  <section className="container py-20 lg:py-24">
    <div className="relative overflow-hidden rounded-3xl bg-gradient-card p-10 lg:p-16 text-primary-foreground shadow-elegant">
      <div className="absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_60%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--success)),transparent_50%)]" />
      </div>
      <div className="relative max-w-2xl">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
          Start billing in 60 seconds.
        </h2>
        <p className="mt-4 text-primary-foreground/80 text-lg">
          No credit card. No setup call. Just your phone number.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button asChild variant="success" size="xl">
            <Link to="/auth">Start Free <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="outline" size="xl" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
            <Link to="/dashboard">Try Demo</Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);
