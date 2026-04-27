import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Camera, Upload, FileText, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

type Step = "scan" | "extracting" | "verify" | "saved";

const Purchases = () => {
  const [step, setStep] = useState<Step>("scan");
  const [data, setData] = useState({
    supplier: "ABC Wholesale",
    invoiceNo: "WH-2384",
    date: "2026-04-25",
    amount: "12,400",
    gst: "18%",
  });

  const startScan = () => {
    setStep("extracting");
    setTimeout(() => setStep("verify"), 1400);
  };

  const save = () => {
    setStep("saved");
    toast.success("Purchase saved · 10 min saved ✨");
    setTimeout(() => setStep("scan"), 1800);
  };

  return (
    <AppShell title="Purchases">
      <div className="px-4 lg:px-8 py-5 lg:py-8 max-w-2xl mx-auto">
        <div className="text-sm text-muted-foreground">Scan a supplier invoice — we'll extract everything for you.</div>

        {step === "scan" && (
          <div className="mt-5 space-y-4">
            <button
              onClick={startScan}
              className="w-full rounded-2xl bg-gradient-card text-primary-foreground p-8 shadow-elegant flex flex-col items-center gap-3 active:scale-[0.98] transition-spring"
            >
              <div className="grid h-16 w-16 place-items-center rounded-full bg-primary-foreground/10 backdrop-blur">
                <Camera className="h-8 w-8" />
              </div>
              <div className="text-lg font-bold">Scan with camera</div>
              <div className="text-xs opacity-80">Auto-extract supplier, items & tax</div>
            </button>

            <button
              onClick={startScan}
              className="w-full rounded-2xl border-2 border-dashed border-input bg-card p-8 flex flex-col items-center gap-3 hover:border-primary transition-base"
            >
              <Upload className="h-7 w-7 text-muted-foreground" />
              <div className="text-sm font-semibold">Upload PDF or image</div>
              <div className="text-xs text-muted-foreground">Drag & drop or tap to select</div>
            </button>
          </div>
        )}

        {step === "extracting" && (
          <div className="mt-12 grid place-items-center text-center animate-fade-in">
            <div className="relative grid h-20 w-20 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
              <Sparkles className="h-9 w-9 animate-pulse" />
            </div>
            <h2 className="mt-5 text-xl font-bold">Reading your invoice…</h2>
            <p className="mt-1 text-sm text-muted-foreground">Extracting supplier, line items, tax</p>
          </div>
        )}

        {step === "verify" && (
          <div className="mt-5 rounded-2xl border border-border bg-card p-6 animate-scale-in">
            <div className="flex items-center gap-2 text-success text-sm font-semibold">
              <CheckCircle2 className="h-4 w-4" /> Extracted successfully
            </div>
            <h2 className="mt-3 font-bold text-lg">Verify the details</h2>

            <div className="mt-5 space-y-4">
              {[
                { k: "supplier",  label: "Supplier" },
                { k: "invoiceNo", label: "Invoice #" },
                { k: "date",      label: "Date" },
                { k: "amount",    label: "Amount (₹)" },
                { k: "gst",       label: "GST" },
              ].map((f) => (
                <div key={f.k}>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">{f.label}</label>
                  <input
                    value={(data as any)[f.k]}
                    onChange={(e) => setData({ ...data, [f.k]: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm font-medium focus:border-primary focus:outline-none transition-base"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep("scan")}>Cancel</Button>
              <Button variant="hero" size="lg" className="flex-1" onClick={save}>Save purchase</Button>
            </div>
          </div>
        )}

        {step === "saved" && (
          <div className="mt-12 grid place-items-center text-center animate-scale-in">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-success text-success-foreground shadow-success">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="mt-5 text-xl font-bold">Saved!</h2>
            <p className="mt-1 text-sm text-success">You just saved 10 minutes of typing</p>
          </div>
        )}

        {/* Recent */}
        {step === "scan" && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent</h3>
            <div className="rounded-2xl border border-border bg-card divide-y divide-border">
              {[
                { s: "ABC Wholesale", n: "WH-2380", a: "₹8,200" },
                { s: "Reliance Distributors", n: "RD-1129", a: "₹15,400" },
                { s: "Local Supplier", n: "LS-022", a: "₹3,750" },
              ].map((p) => (
                <div key={p.n} className="flex items-center gap-3 p-4">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-muted-foreground">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{p.s}</div>
                    <div className="text-xs text-muted-foreground">{p.n}</div>
                  </div>
                  <div className="text-sm font-bold number-display">{p.a}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default Purchases;
