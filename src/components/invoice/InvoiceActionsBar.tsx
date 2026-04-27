import { useState } from "react";
import { MessageCircle, Printer, FileDown, Share2, Check, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { Invoice, shopInfo, formatINR } from "@/data/mock";
import { usePrefs, type PrintFormat } from "@/hooks/usePrefs";
import { InvoiceDocument } from "./InvoiceDocument";
import { ShareSheet } from "./ShareSheet";

type Variant = "compact" | "full";

/**
 * Invoice portability actions: WhatsApp · Print · PDF · Share.
 * Renders a hidden InvoiceDocument that becomes visible only via @media print.
 */
export const InvoiceActionsBar = ({
  invoice,
  variant = "full",
}: {
  invoice: Invoice;
  variant?: Variant;
}) => {
  const { prefs } = usePrefs();
  const [printFormat, setPrintFormat] = useState<PrintFormat>(prefs.printFormat);
  const [showFormat, setShowFormat] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [waSent, setWaSent] = useState(false);
  const [waFailed, setWaFailed] = useState(false);

  const triggerPrint = (format: PrintFormat) => {
    setPrintFormat(format);
    document.body.setAttribute("data-print-format", format);
    // Allow React to render with new format
    requestAnimationFrame(() => {
      window.print();
      setTimeout(() => document.body.removeAttribute("data-print-format"), 500);
    });
  };

  const handlePrint = () => {
    if (variant === "compact") triggerPrint(prefs.printFormat);
    else setShowFormat(true);
  };

  const handlePDF = () => {
    toast("Opening print dialog — choose 'Save as PDF'", { duration: 2500 });
    triggerPrint("a4");
  };

  const handleWhatsApp = () => {
    if (!invoice.partyPhone) {
      toast.error("No phone number on file for this customer");
      return;
    }
    const text = `*${shopInfo.name}*%0AInvoice ${invoice.number}%0AAmount: ${formatINR(invoice.amount)}%0APay via UPI: ${shopInfo.upiId}`;
    const url = `https://wa.me/${invoice.partyPhone}?text=${text}`;
    window.open(url, "_blank");
    // Simulate delivery feedback
    setTimeout(() => {
      const ok = Math.random() > 0.1;
      if (ok) { setWaSent(true); toast.success("Delivered on WhatsApp"); }
      else { setWaFailed(true); toast.error("Send failed — tap retry"); }
    }, 1200);
  };

  const compact = variant === "compact";

  return (
    <>
      <div className={compact ? "grid grid-cols-4 gap-2" : "grid grid-cols-2 lg:grid-cols-4 gap-3"}>
        <ActionButton
          primary
          icon={waSent ? Check : waFailed ? RotateCw : MessageCircle}
          label={waSent ? "Sent" : waFailed ? "Retry WhatsApp" : "Send WhatsApp"}
          onClick={() => { setWaFailed(false); handleWhatsApp(); }}
          tone={waSent ? "success" : waFailed ? "warning" : "primary"}
          compact={compact}
        />
        <ActionButton icon={Printer} label="Print" onClick={handlePrint} compact={compact} />
        <ActionButton icon={FileDown} label="PDF" onClick={handlePDF} compact={compact} />
        <ActionButton icon={Share2} label="Share" onClick={() => setShowShare(true)} compact={compact} />
      </div>

      {/* Hidden print surface */}
      <div className="print-only" aria-hidden>
        <InvoiceDocument invoice={invoice} format={printFormat} />
      </div>

      {showFormat && (
        <PrintFormatSelector
          current={printFormat}
          onPick={(f) => { setShowFormat(false); triggerPrint(f); }}
          onClose={() => setShowFormat(false)}
        />
      )}

      {showShare && <ShareSheet invoice={invoice} onClose={() => setShowShare(false)} />}
    </>
  );
};

const ActionButton = ({
  icon: Icon, label, onClick, primary, tone = "neutral", compact,
}: {
  icon: any; label: string; onClick: () => void; primary?: boolean;
  tone?: "primary" | "success" | "warning" | "neutral"; compact?: boolean;
}) => {
  const toneClass =
    tone === "success" ? "bg-success text-success-foreground border-success hover:bg-success/90"
    : tone === "warning" ? "bg-warning text-warning-foreground border-warning hover:bg-warning/90"
    : primary ? "bg-gradient-primary text-primary-foreground border-transparent hover:opacity-95 shadow-glow"
    : "bg-card border-input hover:border-primary hover:bg-secondary/40 text-foreground";

  return (
    <button
      onClick={onClick}
      className={`flex ${compact ? "flex-col gap-1 py-3" : "flex-col lg:flex-row items-center justify-center gap-2 py-4 lg:py-3.5"} items-center justify-center rounded-xl border-2 font-semibold text-sm transition-base active:scale-[0.97] ${toneClass}`}
    >
      <Icon className={compact ? "h-5 w-5" : "h-4 w-4"} />
      <span className={compact ? "text-[11px]" : "text-sm"}>{label}</span>
    </button>
  );
};

const PrintFormatSelector = ({
  current, onPick, onClose,
}: {
  current: PrintFormat;
  onPick: (f: PrintFormat) => void;
  onClose: () => void;
}) => {
  const opts: { key: PrintFormat; label: string; desc: string }[] = [
    { key: "thermal80", label: "Thermal 80 mm", desc: "Most kirana / POS printers" },
    { key: "thermal58", label: "Thermal 58 mm", desc: "Compact handheld printers" },
    { key: "a4", label: "A4 (full page)", desc: "GST-compliant · for accountant" },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center lg:justify-center bg-background/70 backdrop-blur animate-fade-in" onClick={onClose}>
      <div
        className="w-full lg:max-w-md bg-card lg:rounded-2xl rounded-t-3xl border border-border shadow-elegant p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-1">Choose print format</h3>
        <p className="text-xs text-muted-foreground mb-5">Optimised for 1-second print trigger.</p>
        <div className="space-y-2">
          {opts.map((o) => (
            <button
              key={o.key}
              onClick={() => onPick(o.key)}
              className={`w-full text-left rounded-xl border-2 p-4 flex items-center justify-between transition-base ${
                current === o.key ? "border-primary bg-secondary/40" : "border-input hover:border-primary/40"
              }`}
            >
              <div>
                <div className="font-semibold text-sm">{o.label}</div>
                <div className="text-xs text-muted-foreground">{o.desc}</div>
              </div>
              <Printer className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
