import { Input } from "@/components/ui/input";
import { Search, PanelLeft } from "lucide-react";
import CreateItemDialog from "@/components/dashboard/CreateItemDialog";
import CreateCollectionDialog from "@/components/dashboard/CreateCollectionDialog";

interface TopBarProps {
  onToggleSidebar?: () => void;
}

export default function TopBar({ onToggleSidebar }: TopBarProps) {
  return (
    <header className="h-14 border-b border-border flex items-center gap-3 px-4 shrink-0">
      <div className="flex items-center gap-2 w-48 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
          S
        </div>
        <span className="font-semibold text-sm">DevStash</span>
      </div>

      <div className="flex-1 max-w-xl relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search items..."
          className="pl-9 h-9 bg-muted border-0 text-sm"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-background border border-border rounded px-1.5 py-0.5">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <CreateCollectionDialog />
        <CreateItemDialog />
      </div>
    </header>
  );
}
