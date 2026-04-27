import { Logo } from "@/components/Logo";

export const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="container py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div>
        <Logo />
        <p className="mt-3 text-sm text-muted-foreground max-w-xs">
          GST-ready billing for Indian shops. Built mobile-first.
        </p>
      </div>
      {[
        { title: "Product", links: ["POS", "Invoices", "Reports", "WhatsApp"] },
        { title: "Company", links: ["About", "Pricing", "Contact", "Careers"] },
        { title: "Legal", links: ["Privacy", "Terms", "GST policy", "Refund"] },
      ].map((c) => (
        <div key={c.title}>
          <div className="text-sm font-semibold">{c.title}</div>
          <ul className="mt-3 space-y-2">
            {c.links.map((l) => (
              <li key={l}>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-base">{l}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-border">
      <div className="container py-5 text-xs text-muted-foreground flex justify-between">
        <span>© 2026 BillZo. Made in India.</span>
        <span>v1.0</span>
      </div>
    </div>
  </footer>
);
