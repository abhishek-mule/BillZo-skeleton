import { X, MessageCircle, Bluetooth, Mail, Share2, Link as LinkIcon, Copy } from "lucide-react";
import { toast } from "sonner";
import { Invoice, formatINR } from "@/data/mock";

const channels = [
  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "text-success" },
  { key: "bluetooth", label: "Bluetooth", icon: Bluetooth, color: "text-primary" },
  { key: "email", label: "Email", icon: Mail, color: "text-primary" },
  { key: "nearby", label: "Nearby Share", icon: Share2, color: "text-primary" },
  { key: "link", label: "Copy link", icon: LinkIcon, color: "text-foreground" },
];

export const ShareSheet = ({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) => {
  const summary = `${invoice.number} · ${invoice.party} · ${formatINR(invoice.amount)}`;

  const handle = async (key: string) => {
    if (key === "link") {
      try { await navigator.clipboard.writeText(`${location.origin}/invoices/${invoice.id}`); }
      catch { /* noop */ }
      toast.success("Invoice link copied");
    } else if (key === "whatsapp") {
      toast.success("Opening WhatsApp…");
    } else {
      toast.success(`Shared via ${channels.find((c) => c.key === key)?.label}`);
    }
    onClose();
  };

  const tryNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: invoice.number, text: summary, url: `${location.origin}/invoices/${invoice.id}` });
        onClose();
      } catch { /* user cancel */ }
    } else {
      handle("link");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center lg:justify-center bg-background/70 backdrop-blur animate-fade-in" onClick={onClose}>
      <div
        className="w-full lg:max-w-md bg-card lg:rounded-2xl rounded-t-3xl border border-border shadow-elegant p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold">Share invoice</h3>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="text-xs text-muted-foreground mb-5">{summary}</div>

        <div className="grid grid-cols-4 gap-3">
          {channels.map(({ key, label, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => handle(key)}
              className="flex flex-col items-center gap-2 rounded-xl p-3 hover:bg-secondary transition-base"
            >
              <div className={`grid h-12 w-12 place-items-center rounded-full bg-secondary ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-medium text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={tryNative}
          className="mt-5 w-full rounded-xl border border-input p-3 text-sm font-medium inline-flex items-center justify-center gap-2 hover:bg-secondary transition-base"
        >
          <Copy className="h-4 w-4" /> More apps…
        </button>
      </div>
    </div>
  );
};
