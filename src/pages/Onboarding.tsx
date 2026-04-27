import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Loader2, Store, CheckCircle2 } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const [shop, setShop] = useState("");
  const [gstin, setGstin] = useState("");
  const [loading, setLoading] = useState<"idle" | "creating" | "done">("idle");

  const handleStart = () => {
    if (!shop.trim()) return;
    setLoading("creating");
    setTimeout(() => setLoading("done"), 900);
    setTimeout(() => navigate("/pos"), 1700);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <header className="container py-5"><Logo /></header>
      <div className="flex-1 grid place-items-center px-4 pb-16">
        <div className="w-full max-w-md animate-scale-in">
          {loading === "idle" || loading === "creating" ? (
            <div className="rounded-2xl border border-border bg-card shadow-elegant p-7">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <Store className="h-6 w-6" />
              </div>
              <h1 className="mt-5 text-2xl font-bold tracking-tight">Set up your shop</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">Just two quick fields. You can change everything later.</p>

              <label className="mt-7 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Shop name <span className="text-destructive">*</span>
              </label>
              <input
                autoFocus
                value={shop}
                onChange={(e) => setShop(e.target.value)}
                placeholder="Ravi Electronics"
                className="mt-2 w-full rounded-xl border-2 border-input bg-background px-4 py-3 text-base font-medium focus:border-primary focus:outline-none transition-base"
              />

              <label className="mt-5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                GSTIN <span className="font-normal normal-case text-muted-foreground/70">(optional)</span>
              </label>
              <input
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                placeholder="27ABCDE1234F1Z5"
                className="mt-2 w-full rounded-xl border-2 border-input bg-background px-4 py-3 text-base font-medium tracking-wider focus:border-primary focus:outline-none transition-base"
              />

              <Button variant="hero" size="xl" className="mt-7 w-full" onClick={handleStart} disabled={!shop.trim() || loading === "creating"}>
                {loading === "creating" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start Billing"}
              </Button>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card shadow-elegant p-10 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success-soft text-success animate-scale-in">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h1 className="mt-5 text-2xl font-bold">You're all set!</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">Opening POS…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
