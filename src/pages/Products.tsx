import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/data/mock";
import { useStore } from "@/store/useStore";
import { Search, Plus, AlertTriangle } from "lucide-react";

const Products = () => {
  const [q, setQ] = useState("");
  const products = useStore((s) => s.products);
  const filtered = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  const lowStock = products.filter((p) => p.stock < 20).length;

  return (
    <AppShell title="Products">
      <div className="px-4 lg:px-8 py-5 lg:py-8 max-w-5xl mx-auto space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Total products" value={products.length.toString()} />
          <Stat label="Low stock" value={lowStock.toString()} warn={lowStock > 0} />
          <Stat label="Stock value" value={formatINR(products.reduce((s, p) => s + p.price * p.stock, 0))} />
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products"
              className="w-full h-11 rounded-xl border border-input bg-card pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button variant="hero" size="lg">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_100px_100px_100px_100px] gap-4 px-5 py-3 border-b border-border bg-secondary/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Name</span><span>HSN</span><span>GST</span><span className="text-right">Price</span><span className="text-right">Stock</span>
          </div>
          <ul className="divide-y divide-border">
            {filtered.map((p) => (
              <li key={p.id} className="sm:grid sm:grid-cols-[1fr_100px_100px_100px_100px] sm:gap-4 sm:items-center px-5 py-4 hover:bg-muted/40 transition-base">
                <div>
                  <div className="font-semibold text-sm">{p.name}</div>
                  <div className="text-xs text-muted-foreground sm:hidden mt-0.5">HSN {p.hsn} • GST {p.gst}%</div>
                </div>
                <div className="hidden sm:block text-sm text-muted-foreground">{p.hsn}</div>
                <div className="hidden sm:block text-sm text-muted-foreground">{p.gst}%</div>
                <div className="sm:text-right mt-2 sm:mt-0 flex sm:block justify-between text-sm">
                  <span className="sm:hidden text-muted-foreground">Price</span>
                  <span className="font-bold number-display">{formatINR(p.price)}</span>
                </div>
                <div className="sm:text-right mt-1 sm:mt-0 flex sm:block justify-between items-center">
                  <span className="sm:hidden text-muted-foreground text-sm">Stock</span>
                  <span className={`text-sm font-semibold ${p.stock < 20 ? "text-warning" : "text-success"} number-display`}>
                    {p.stock < 20 && <AlertTriangle className="inline h-3 w-3 mr-1" />}
                    {p.stock}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
};

const Stat = ({ label, value, warn }: { label: string; value: string; warn?: boolean }) => (
  <div className={`rounded-xl border p-4 ${warn ? "border-warning/40 bg-warning-soft" : "border-border bg-card"}`}>
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className={`mt-1 text-xl font-bold number-display ${warn ? "text-warning" : ""}`}>{value}</div>
  </div>
);

export default Products;
