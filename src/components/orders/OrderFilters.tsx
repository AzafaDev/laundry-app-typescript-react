import { Loader2, X } from "lucide-react";
import type { OrderStatus } from "../../types/order";
import { STATUS_FILTER_OPTIONS } from "./orderConstants";

interface Props {
  searchInput: string;
  status: OrderStatus | "";
  hasFilters: boolean;
  isSearching?: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: OrderStatus | "") => void;
  onClear: () => void;
}

export function OrderFilters({ searchInput, status, hasFilters, isSearching, onSearchChange, onStatusChange, onClear }: Props) {
  return (
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
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as OrderStatus | "")}
        className="rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
      >
        {STATUS_FILTER_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
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
  );
}
