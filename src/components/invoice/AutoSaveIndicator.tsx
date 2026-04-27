import { Check, Cloud, CloudOff } from "lucide-react";

export const AutoSaveIndicator = ({ synced = true }: { synced?: boolean }) => (
  <div className="inline-flex items-center gap-2 text-xs">
    <span className="inline-flex items-center gap-1 text-success">
      <Check className="h-3 w-3" /> Saved locally
    </span>
    <span className="text-border">•</span>
    {synced ? (
      <span className="inline-flex items-center gap-1 text-success">
        <Cloud className="h-3 w-3" /> Synced
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-warning">
        <CloudOff className="h-3 w-3" /> Will sync when online
      </span>
    )}
  </div>
);
