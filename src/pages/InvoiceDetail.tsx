import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { AppShell } from "@/components/app/AppShell";
import { mockInvoices, formatINR, shopInfo } from "@/data/mock";
import { InvoiceActionsBar } from "@/components/invoice/InvoiceActionsBar";
import { AutoSaveIndicator } from "@/components/invoice/AutoSaveIndicator";
import { ArrowLeft, Phone, Calendar, Receipt } from "lucide-react";

const statusStyle: Record<string, string> = {
  synced:  "bg-success-soft text-success",
  pending: "bg-warning-soft text-warning",
  failed:  "bg-destructive/10 text-destructive",
};

const InvoiceDetail = () => {
  const { id } = useParams();
  const invoice = useMemo(() => mockInvoices.find((i) => i.id === id), [id]);

  if (!invoice) {
    return (
      <AppShell title="Invoice">
        <div className="px-4 py-12 text-center text-sm text-muted-foreground">
          Invoice not found.{" "}
          <Link to="/invoices" className="text-primary font-medium">Back to invoices</Link>
        </div>
      </AppShell>
    );
  }

  const items = invoice.items ?? [];
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = items.reduce((s, i) => s + (i.price * i.qty * i.gst) / 100, 0);
  const total = subtotal + tax || invoice.amount;
  const paid = invoice.method !== "udhar" && invoice.status !== "failed";

  return (
    <AppShell title={invoice.number}>
      <div className="px-4 lg:px-8 py-5 lg:py-8 max-w-3xl mx-auto space-y-5">
        <Link to="/invoices" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> All invoices
        </Link>

        <div className="rounded-2xl border border-border bg-card p-5 lg:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                <Receipt className="h-3.5 w-3.5" /> {invoice.number}
              </div>
              <div className="mt-1 text-3xl lg:text-4xl font-bold number-display">{formatINR(total)}</div>
              <div className="mt-2 inline-flex items-center gap-2 flex-wrap">
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${statusStyle[invoice.status]}`}>
                  {invoice.status}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${paid ? "bg-success-soft text-success" : "bg-warning-soft text-warning"}`}>
                  {paid ? "PAID" : "UNPAID"}
                </span>
                <span className="text-xs text-muted-foreground capitalize">· {invoice.method}</span>
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground hidden sm:block">
              <div className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {invoice.date}</div>
            </div>
          </div>
          <div className="mt-3"><AutoSaveIndicator synced={invoice.status === "synced"} /></div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Send to customer</h2>
            <span className="text-[11px] text-muted-foreground">&lt; 5s delivery</span>
          </div>
          <InvoiceActionsBar invoice={invoice} />
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Customer</div>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-sm font-semibold">
              {invoice.party.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">{invoice.party}</div>
              {invoice.partyPhone && (
                <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {invoice.partyPhone}
                </div>
              )}
            </div>
          </div>
        </div>

        {items.length > 0 && (
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-3 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Items
            </div>
            <ul className="divide-y divide-border">
              {items.map((it, i) => (
                <li key={i} className="px-5 py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{it.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {it.qty} × {formatINR(it.price)} · GST {it.gst}%
                      {it.hsn && <> · HSN {it.hsn}</>}
                    </div>
                  </div>
                  <div className="text-sm font-bold number-display whitespace-nowrap">
                    {formatINR(it.qty * it.price)}
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-border p-5 space-y-1.5 bg-secondary/30 text-sm">
              <Row label="Subtotal" value={formatINR(subtotal)} />
              <Row label="GST" value={formatINR(tax)} />
              <Row label="Total" value={formatINR(total)} bold />
            </div>
          </div>
        )}

        <div className="text-center text-[11px] text-muted-foreground pt-4">
          Issued by <b>{shopInfo.name}</b> · GSTIN {shopInfo.gstin}
        </div>
      </div>
    </AppShell>
  );
};

const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <div className={`flex justify-between ${bold ? "text-base font-bold pt-1.5 border-t border-border" : "text-muted-foreground"}`}>
    <span>{label}</span>
    <span className="number-display text-foreground">{value}</span>
  </div>
);

export default InvoiceDetail;
