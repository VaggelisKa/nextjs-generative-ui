import { Loader2 } from "lucide-react";

export function GenericLoader() {
  return (
    <div
      className="flex items-center justify-center"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="pr-2">Loading message...</span>
      <Loader2 className="animate-spin text-muted-foreground" size={16} />
    </div>
  );
}
