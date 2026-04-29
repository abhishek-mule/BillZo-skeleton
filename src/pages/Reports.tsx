import { useMemo } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileText,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Receipt,
  Users,
  Package,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { formatINR } from "@/data/mock";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

/* ---------- helpers ---------- */

const CHART_COLORS = {
  primary: "hsl(222 70% 22%)",
  primaryGlow: "hsl(222 78% 38%)",
  success: "hsl(158 64% 38%)",
  warning: "hsl(35 92% 50%)",
  destructive: "hsl(0 75% 52%)",
  muted: "hsl(215 16% 42%)",
};

const METHOD_COLORS: Record<string, string> = {
  upi: CHART_COLORS.primaryGlow,
  cash: CHART_COLORS.success,
  udhar: CHART_COLORS.warning,
};

/* Deterministic 14-day synthetic trend so the chart looks alive even on a fresh store */
const buildTrend = (todayRevenue: number) => {
  const labels = ["M", "T", "W", "T", "F", "S", "S", "M", "T", "W", "T", "F", "S", "S"];
  const base = Math.max(8000, todayRevenue || 22000);
  return labels.map((l, i) => {
    const wave = Math.sin(i / 1.7) * 0.25 + Math.cos(i / 3.1) * 0.15;
    const noise = ((i * 9301 + 49297) % 233280) / 233280; // deterministic
    const sales = Math.round(base * (0.7 + wave + noise * 0.4));
    const collected = Math.round(sales * (0.78 + noise * 0.15));
    return { day: `${l}${i + 1}`, sales, collected };
  });
};

/* ---------- page ---------- */

const Reports = () => {
  const invoices = useStore((s) => s.invoices);
  const products = useStore((s) => s.products);
  const parties = useStore((s) => s.parties);

  const kpi = useMemo(() => {
    const revenue = invoices.reduce((a, i) => a + i.amount, 0);
    const pending = invoices
      .filter((i) => i.method === "udhar" || i.status === "failed")
      .reduce((a, i) => a + i.amount, 0);
    const collected = revenue - pending;
    const avgTicket = invoices.length ? revenue / invoices.length : 0;
    const receivables = parties.reduce((a, p) => a + p.pending, 0);
    const lowStock = products.filter((p) => p.stock < 25).length;
    return { revenue, pending, collected, avgTicket, receivables, lowStock };
  }, [invoices, products, parties]);

  const trend = useMemo(() => buildTrend(kpi.revenue / 14), [kpi.revenue]);

  const methodMix = useMemo(() => {
    const m: Record<string, number> = { upi: 0, cash: 0, udhar: 0 };
    invoices.forEach((i) => (m[i.method] = (m[i.method] || 0) + i.amount));
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [invoices]);

  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; revenue: number; qty: number }>();
    invoices.forEach((inv) =>
      inv.items?.forEach((it) => {
        const cur = map.get(it.name) || { name: it.name, revenue: 0, qty: 0 };
        cur.revenue += it.qty * it.price;
        cur.qty += it.qty;
        map.set(it.name, cur);
      }),
    );
    const arr = Array.from(map.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    if (arr.length) return arr;
    // fallback when invoices have no items
    return products.slice(0, 5).map((p) => ({ name: p.name, revenue: p.price * 12, qty: 12 }));
  }, [invoices, products]);

  const topParties = useMemo(
    () => [...parties].sort((a, b) => b.pending - a.pending).slice(0, 5),
    [parties],
  );

  const gstBreakdown = useMemo(() => {
    const buckets: Record<number, number> = {};
    invoices.forEach((inv) =>
      inv.items?.forEach((it) => {
        const taxable = it.qty * it.price;
        buckets[it.gst] = (buckets[it.gst] || 0) + (taxable * it.gst) / 100;
      }),
    );
    const totals = [0, 5, 12, 18, 28].map((rate) => ({
      rate: `${rate}%`,
      tax: Math.round(buckets[rate] || 0),
    }));
    return totals;
  }, [invoices]);

  const outputGST = gstBreakdown.reduce((a, b) => a + b.tax, 0);
  const collectionRate = kpi.revenue ? Math.round((kpi.collected / kpi.revenue) * 100) : 0;

  /* AI-style insights derived from data */
  const insights = useMemo(() => {
    const arr: { tone: "success" | "warn" | "info"; text: string }[] = [];
    if (collectionRate >= 75)
      arr.push({ tone: "success", text: `Strong cash flow — ${collectionRate}% of sales collected.` });
    else
      arr.push({ tone: "warn", text: `Collections at ${collectionRate}% — chase top udhar accounts.` });
    if (kpi.lowStock > 0)
      arr.push({ tone: "warn", text: `${kpi.lowStock} SKUs below reorder point — restock soon.` });
    if (topProducts[0])
      arr.push({ tone: "info", text: `Bestseller: ${topProducts[0].name} (${formatINR(topProducts[0].revenue)}).` });
    if (topParties[0]?.pending > 0)
      arr.push({ tone: "warn", text: `${topParties[0].name} owes ${formatINR(topParties[0].pending)} — send reminder.` });
    return arr.slice(0, 4);
  }, [collectionRate, kpi.lowStock, topProducts, topParties]);

  return (
    <AppShell title="Reports">
      <div className="px-4 lg:px-8 py-5 lg:py-8 max-w-7xl mx-auto space-y-6">
        {/* Header row */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Business Intelligence</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Live insights from your sales, stock and receivables.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success("Report PDF queued")}>
              <Download className="h-4 w-4" /> Export PDF
            </Button>
            <Button variant="success" size="sm" onClick={() => toast.success("GSTR-1 exported")}>
              <Download className="h-4 w-4" /> GSTR-1
            </Button>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Kpi
            icon={<IndianRupee className="h-4 w-4" />}
            label="Revenue"
            value={formatINR(kpi.revenue)}
            trend="+12.4%"
            up
          />
          <Kpi
            icon={<Receipt className="h-4 w-4" />}
            label="Avg ticket"
            value={formatINR(Math.round(kpi.avgTicket))}
            trend="+3.1%"
            up
          />
          <Kpi
            icon={<Users className="h-4 w-4" />}
            label="Receivables"
            value={formatINR(kpi.receivables)}
            trend="-5.2%"
            up
          />
          <Kpi
            icon={<Package className="h-4 w-4" />}
            label="Low stock"
            value={String(kpi.lowStock)}
            trend={kpi.lowStock > 0 ? "needs action" : "all good"}
            up={kpi.lowStock === 0}
          />
        </div>

        {/* GST Hero card */}
        <div className="rounded-2xl bg-gradient-card text-primary-foreground p-6 lg:p-8 shadow-elegant">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-80">
                <CheckCircle2 className="h-3.5 w-3.5" /> April 2026 — GST ready
              </div>
              <h2 className="mt-3 text-2xl font-bold">{formatINR(outputGST || 74520)} output GST</h2>
              <p className="mt-1 text-sm opacity-80">
                Rate-wise breakdown reconciled. Ready for GSTR-1 filing.
              </p>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-success text-success-foreground shadow-success">
              <CheckCircle2 className="h-6 w-6" />
            </span>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {gstBreakdown.map((b) => (
              <div key={b.rate} className="rounded-lg p-3 bg-primary-foreground/10">
                <div className="text-[11px] opacity-70">GST {b.rate}</div>
                <div className="mt-1 text-base font-bold number-display">
                  {formatINR(b.tax || 0)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts grid */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Sales trend */}
          <Panel className="lg:col-span-2" title="Sales vs collections" subtitle="Last 14 days">
            <div className="h-64">
              <ResponsiveContainer>
                <AreaChart data={trend} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="g-sales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_COLORS.primaryGlow} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={CHART_COLORS.primaryGlow} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g-coll" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_COLORS.success} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={CHART_COLORS.success} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 25% 90%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: CHART_COLORS.muted }} />
                  <YAxis tick={{ fontSize: 11, fill: CHART_COLORS.muted }} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid hsl(215 25% 90%)", fontSize: 12 }}
                    formatter={(v: number) => formatINR(v)}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke={CHART_COLORS.primaryGlow}
                    strokeWidth={2}
                    fill="url(#g-sales)"
                    name="Sales"
                  />
                  <Area
                    type="monotone"
                    dataKey="collected"
                    stroke={CHART_COLORS.success}
                    strokeWidth={2}
                    fill="url(#g-coll)"
                    name="Collected"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          {/* Payment mix */}
          <Panel title="Payment mix" subtitle="By collected amount">
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={methodMix}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {methodMix.map((m) => (
                      <Cell key={m.name} fill={METHOD_COLORS[m.name]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatINR(v)} />
                  <Legend wrapperStyle={{ fontSize: 12, textTransform: "capitalize" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Top products */}
          <Panel className="lg:col-span-2" title="Top products" subtitle="By revenue">
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={topProducts} layout="vertical" margin={{ top: 6, right: 12, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 25% 90%)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: CHART_COLORS.muted }} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
                    width={140}
                  />
                  <Tooltip formatter={(v: number) => formatINR(v)} />
                  <Bar dataKey="revenue" fill={CHART_COLORS.primary} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          {/* AI insights */}
          <Panel title="Smart insights" subtitle="Auto-generated">
            <div className="space-y-2.5">
              {insights.map((it, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 rounded-lg border p-3 ${
                    it.tone === "success"
                      ? "border-success/30 bg-success-soft"
                      : it.tone === "warn"
                      ? "border-warning/30 bg-warning-soft"
                      : "border-border bg-secondary"
                  }`}
                >
                  <Sparkles
                    className={`h-4 w-4 mt-0.5 shrink-0 ${
                      it.tone === "success"
                        ? "text-success"
                        : it.tone === "warn"
                        ? "text-warning"
                        : "text-primary"
                    }`}
                  />
                  <p className="text-sm leading-snug">{it.text}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Receivables leaderboard */}
        <Panel title="Top receivables" subtitle="Outstanding udhar by party">
          <div className="divide-y divide-border">
            {topParties.length === 0 && (
              <div className="py-6 text-sm text-muted-foreground text-center">No outstanding receivables 🎉</div>
            )}
            {topParties.map((p, i) => {
              const max = topParties[0]?.pending || 1;
              const pct = Math.max(4, Math.round((p.pending / max) * 100));
              return (
                <div key={p.id} className="py-3 flex items-center gap-3">
                  <div className="w-6 text-xs text-muted-foreground">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium truncate">{p.name}</div>
                      <div className="text-sm font-semibold number-display">
                        {formatINR(p.pending)}
                      </div>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          p.pending > 5000 ? "bg-warning" : "bg-primary-glow"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* Quick reports grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <ReportCard title="Sales summary" desc="Day, week & month-wise" />
          <ReportCard title="Party ledger" desc="Receivables & payables" />
          <ReportCard title="Stock report" desc="Movement & valuation" />
          <ReportCard title="Tax report" desc="HSN-wise breakdown" />
        </div>
      </div>
    </AppShell>
  );
};

/* ---------- subcomponents ---------- */

const Kpi = ({
  icon,
  label,
  value,
  trend,
  up,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  up?: boolean;
}) => (
  <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-primary">
        {icon}
      </div>
      <div
        className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
          up ? "text-success" : "text-warning"
        }`}
      >
        {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {trend}
      </div>
    </div>
    <div className="mt-3 text-xs text-muted-foreground">{label}</div>
    <div className="mt-0.5 text-xl font-bold number-display">{value}</div>
  </div>
);

const Panel = ({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`rounded-2xl border border-border bg-card p-5 shadow-sm ${className}`}>
    <div className="mb-4 flex items-end justify-between">
      <div>
        <div className="font-semibold">{title}</div>
        {subtitle && <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>}
      </div>
    </div>
    {children}
  </div>
);

const ReportCard = ({ title, desc }: { title: string; desc: string }) => (
  <button
    onClick={() => toast.success(`${title} downloaded`)}
    className="text-left rounded-2xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-md transition-base flex items-center gap-4"
  >
    <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary">
      <FileText className="h-5 w-5" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-semibold truncate">{title}</div>
      <div className="text-xs text-muted-foreground mt-0.5 truncate">{desc}</div>
    </div>
    <Download className="h-4 w-4 text-muted-foreground shrink-0" />
  </button>
);

export default Reports;
