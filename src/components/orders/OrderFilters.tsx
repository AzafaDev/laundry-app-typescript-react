import { Loader2, X } from "lucide-react";
import { STATUS_GROUPS } from "./orderConstants";

interface Props {
  searchInput: string;
  statusGroup: string;
  hasFilters: boolean;
  isSearching?: boolean;
  onSearchChange: (value: string) => void;
  onStatusGroupChange: (key: string) => void;
  onClear: () => void;
}

export function OrderFilters({
  searchInput,
  statusGroup,
  hasFilters,
  isSearching,
  onSearchChange,
  onStatusGroupChange,
  onClear,
}: Props) {
  return (
    <div className="space-y-3">
      <div
        role="tablist"
        aria-label="Filter status pesanan"
        className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0"
      >
        {STATUS_GROUPS.map((group) => {
          const active = group.key === statusGroup;
          return (
            <button
              key={group.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onStatusGroupChange(group.key)}
              className={`shrink-0 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-colors border ${
                active
                  ? "bg-primary text-on-primary border-primary"
                  : "bg-surface text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary"
              }`}
            >
              {group.label}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nomor invoice..."
            className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-2.5 pr-9 text-sm focus:border-primary focus:outline-none"
          />
          {isSearching && (
            <Loader2
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-on-surface-variant"
              aria-label="Mencari..."
            />
          )}
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-outline-variant px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
          >
            <X className="w-4 h-4" />
            Hapus
          </button>
        )}
      </div>
    </div>
  );
}
