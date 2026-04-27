import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Menu } from "lucide-react";

export const Navbar = () => (
  <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
    <div className="container flex h-16 items-center justify-between">
      <Logo />
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <a href="#features" className="hover:text-foreground transition-base">Features</a>
        <a href="#demo" className="hover:text-foreground transition-base">Demo</a>
        <a href="#pricing" className="hover:text-foreground transition-base">Pricing</a>
      </nav>
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
          <Link to="/auth">Sign in</Link>
        </Button>
        <Button asChild variant="hero" size="sm">
          <Link to="/auth">Start Free</Link>
        </Button>
        <button className="md:hidden grid h-9 w-9 place-items-center rounded-lg border border-input">
          <Menu className="h-4 w-4" />
        </button>
      </div>
    </div>
  </header>
);
