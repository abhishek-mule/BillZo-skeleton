import { NavLink } from "react-router-dom";
import { Home, Receipt, ScanLine, Package, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/invoices", label: "Bills", icon: Receipt },
  { to: "/pos", label: "POS", icon: ScanLine, primary: true },
  { to: "/products", label: "Stock", icon: Package },
  { to: "/more", label: "More", icon: MoreHorizontal },
];

export const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur lg:hidden">
    <div className="grid grid-cols-5 px-2 pb-[env(safe-area-inset-bottom)]">
      {items.map(({ to, label, icon: Icon, primary }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-base",
              isActive ? "text-primary" : "text-muted-foreground",
            )
          }
        >
          {primary ? (
            <span className="-mt-6 grid h-14 w-14 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
              <Icon className="h-6 w-6" />
            </span>
          ) : (
            <Icon className="h-5 w-5" />
          )}
          <span className={cn(primary && "mt-0.5")}>{label}</span>
        </NavLink>
      ))}
    </div>
  </nav>
);
