import { NavLink, useLocation } from "react-router-dom";
import {
  Home, ScanLine, Receipt, ShoppingBag, Users, Package, BarChart3, Settings,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/pos", label: "POS", icon: ScanLine },
  { to: "/invoices", label: "Invoices", icon: Receipt },
  { to: "/purchases", label: "Purchases", icon: ShoppingBag },
  { to: "/parties", label: "Parties", icon: Users },
  { to: "/products", label: "Products", icon: Package },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export const DesktopSidebar = () => {
  const { pathname } = useLocation();
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="px-6 py-5 border-b border-sidebar-border">
        <Logo className="text-sidebar-foreground" />
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-base",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <div className="rounded-lg bg-sidebar-accent/50 p-3">
          <div className="flex items-center gap-2 text-xs text-sidebar-foreground/70">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse-dot" />
            All synced
          </div>
          <p className="mt-1 text-xs text-sidebar-foreground/60">Last: just now</p>
        </div>
      </div>
    </aside>
  );
};
