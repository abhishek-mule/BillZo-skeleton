import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`inline-flex items-center gap-2 font-bold text-lg ${className}`}>
    <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
      <Sparkles className="h-4 w-4" />
    </span>
    <span className="tracking-tight">BillZo</span>
  </Link>
);
