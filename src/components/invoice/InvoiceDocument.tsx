import { Invoice, shopInfo, formatINR } from "@/data/mock";
import type { PrintFormat } from "@/hooks/usePrefs";

/**
 * Print-only invoice document. Renders nothing on screen — only inside @media print.
 * Two layouts via data-format: thermal (58/80mm, monospaced) and A4 (GST-compliant).
 */
export const InvoiceDocument = ({
  invoice,
  format,
}: {
  invoice: Invoice;
  format: PrintFormat;
}) => {
  const items = invoice.items ?? [];
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = items.reduce((s, i) => s + (i.price * i.qty * i.gst) / 100, 0);
  const total = subtotal + tax || invoice.amount;

  return (
    <div className="invoice-print-root" data-format={format}>
      {format === "a4" ? (
        <A4Layout invoice={invoice} items={items} subtotal={subtotal} tax={tax} total={total} />
      ) : (
        <ThermalLayout invoice={invoice} items={items} subtotal={subtotal} tax={tax} total={total} width={format === "thermal58" ? 58 : 80} />
      )}
    </div>
  );
};

const ThermalLayout = ({ invoice, items, subtotal, tax, total, width }: any) => (
  <div className={`thermal w-${width}`}>
    <div className="t-center t-bold">{shopInfo.name}</div>
    <div className="t-center t-sm">{shopInfo.address}</div>
    <div className="t-center t-sm">GSTIN: {shopInfo.gstin}</div>
    <div className="t-divider">--------------------------------</div>
    <div className="t-row"><span>Bill: {invoice.number}</span><span>{invoice.date}</span></div>
    <div>To: {invoice.party}</div>
    {invoice.partyPhone && <div className="t-sm">{invoice.partyPhone}</div>}
    <div className="t-divider">--------------------------------</div>
    <div className="t-row t-bold"><span>Item</span><span>Amt</span></div>
    <div className="t-divider">--------------------------------</div>
    {items.length === 0 ? (
      <div className="t-row"><span>1 × Sale</span><span>{Math.round(total)}</span></div>
    ) : items.map((i: any, idx: number) => (
      <div key={idx}>
        <div className="t-truncate">{i.name}</div>
        <div className="t-row t-sm">
          <span>{i.qty} × {i.price}</span>
          <span>{Math.round(i.qty * i.price)}</span>
        </div>
      </div>
    ))}
    <div className="t-divider">--------------------------------</div>
    {items.length > 0 && (
      <>
        <div className="t-row t-sm"><span>Subtotal</span><span>{Math.round(subtotal)}</span></div>
        <div className="t-row t-sm"><span>GST</span><span>{Math.round(tax)}</span></div>
      </>
    )}
    <div className="t-row t-bold t-lg"><span>TOTAL</span><span>₹{Math.round(total)}</span></div>
    <div className="t-divider">--------------------------------</div>
    <div className="t-sm">Paid via: {invoice.method.toUpperCase()}</div>
    <div className="t-divider">--------------------------------</div>
    <div className="t-center t-sm">Pay via UPI: {shopInfo.upiId}</div>
    <div className="t-center t-sm" style={{ marginTop: "6px" }}>Thank you · Visit again</div>
    <div className="t-center t-sm">Powered by BillZo</div>
  </div>
);

const A4Layout = ({ invoice, items, subtotal, tax, total }: any) => (
  <div className="a4">
    <div className="a4-header">
      <div>
        <div className="a4-title">TAX INVOICE</div>
        <div className="a4-shop">{shopInfo.name}</div>
        <div className="a4-meta">{shopInfo.address}</div>
        <div className="a4-meta">{shopInfo.phone}</div>
        <div className="a4-meta">GSTIN: {shopInfo.gstin}</div>
      </div>
      <div className="a4-right">
        <div className="a4-meta-row"><span>Invoice #</span><b>{invoice.number}</b></div>
        <div className="a4-meta-row"><span>Date</span><b>{invoice.date}</b></div>
        <div className="a4-meta-row"><span>Method</span><b>{invoice.method.toUpperCase()}</b></div>
      </div>
    </div>

    <div className="a4-bill-to">
      <div className="a4-label">Bill To</div>
      <div className="a4-bill-name">{invoice.party}</div>
      {invoice.partyPhone && <div className="a4-meta">{invoice.partyPhone}</div>}
    </div>

    <table className="a4-table">
      <thead>
        <tr>
          <th>#</th><th>Item</th><th>HSN</th><th className="r">Qty</th><th className="r">Rate</th><th className="r">GST%</th><th className="r">Amount</th>
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <tr><td>1</td><td colSpan={5}>Sale</td><td className="r">{formatINR(total)}</td></tr>
        ) : items.map((i: any, idx: number) => (
          <tr key={idx}>
            <td>{idx + 1}</td><td>{i.name}</td><td>{i.hsn || "-"}</td>
            <td className="r">{i.qty}</td><td className="r">{i.price}</td><td className="r">{i.gst}%</td>
            <td className="r">{formatINR(i.qty * i.price)}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="a4-totals">
      <div className="a4-totals-box">
        <div className="a4-totals-row"><span>Subtotal</span><span>{formatINR(subtotal || total)}</span></div>
        <div className="a4-totals-row"><span>GST</span><span>{formatINR(tax)}</span></div>
        <div className="a4-totals-row a4-grand"><span>Total</span><span>{formatINR(total)}</span></div>
      </div>
    </div>

    <div className="a4-footer">
      <div>
        <div className="a4-label">Pay via UPI</div>
        <div className="a4-meta">{shopInfo.upiId}</div>
      </div>
      <div className="a4-sign">
        <div className="a4-sign-line" />
        <div className="a4-meta">Authorised Signature</div>
      </div>
    </div>
    <div className="a4-tag">Powered by BillZo</div>
  </div>
);
