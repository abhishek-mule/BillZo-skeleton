import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { DesktopSidebar } from "./DesktopSidebar";
import { Logo } from "@/components/Logo";
import { Bell, Search } from "lucide-react";

export const AppShell = ({ children, title }: { children: ReactNode; title?: string }) => (
  <div className="flex min-h-screen w-full bg-background">
    <DesktopSidebar />
    <div className="flex-1 flex flex-col min-w-0">
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-card/95 backdrop-blur px-4 h-14">
        <Logo />
        <div className="flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-medium text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
          Online
        </div>
      </header>
      {/* Desktop top bar */}
      <header className="hidden lg:flex sticky top-0 z-30 items-center justify-between gap-4 border-b border-border bg-card/95 backdrop-blur px-8 h-16">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search invoices, products, parties…"
              className="h-9 w-80 rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button className="grid h-9 w-9 place-items-center rounded-lg border border-input hover:bg-accent">
            <Bell className="h-4 w-4" />
          </button>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold">R</div>
        </div>
      </header>
      <main className="flex-1 pb-24 lg:pb-8 animate-fade-in">{children}</main>
      <BottomNav />
    </div>
  </div>
);
