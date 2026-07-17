import { X } from "lucide-react";
import type { OrderStatus } from "../../types/order";
import { STATUS_FILTER_OPTIONS } from "./orderConstants";

interface Props {
  searchInput: string;
  status: OrderStatus | "";
  hasFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: OrderStatus | "") => void;
  onClear: () => void;
}

export function OrderFilters({ searchInput, status, hasFilters, onSearchChange, onStatusChange, onClear }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={searchInput}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Cari nomor invoice..."
        className="flex-1 rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
      />
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
