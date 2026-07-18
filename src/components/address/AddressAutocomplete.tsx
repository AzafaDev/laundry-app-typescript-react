import { useEffect, useRef, useState } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useGeocodeSearchQuery } from "../../hooks/geocode/useGeocodeSearchQuery";
import type { GeocodeResult } from "../../types/geocode";
import { FormField } from "../FormField";
import { inputClasses } from "../ui/Input";

type GeocodeSearchQueryHook = (query: string, limit?: number) => UseQueryResult<GeocodeResult[], Error>;

interface AddressAutocompleteProps {
  onSelect: (result: GeocodeResult) => void;
  placeholder?: string;
  useSearchQuery?: GeocodeSearchQueryHook;
}

export function AddressAutocomplete({
  onSelect,
  placeholder,
  useSearchQuery = useGeocodeSearchQuery,
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebouncedValue(inputValue, 400);
  const query = useSearchQuery(debouncedQuery);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isOpen = inputValue.length >= 3 && isFocused;
  const isWaitingForDebounce = debouncedQuery !== inputValue;
  const showLoading = isWaitingForDebounce || query.isFetching;
  const showEmpty = !showLoading && query.data?.length === 0;
  const showResults = !showLoading && (query.data?.length ?? 0) > 0;

  const handleSelect = (result: GeocodeResult) => {
    setInputValue(result.formatted);
    setIsFocused(false);
    onSelect(result);
  };

  return (
    <FormField label="Cari alamat" htmlFor="address_autocomplete" hint="Ketik minimal 3 karakter">
      <div className="relative" ref={wrapRef}>
        <input
          id="address_autocomplete"
          className={inputClasses}
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          autoComplete="off"
        />

        {isOpen && (
          // Leaflet's own panes/controls use z-index up to 1000 (see
          // leaflet.css) and share this stacking context, so this has to
          // clear that or AddressMap paints over the dropdown regardless
          // of DOM order.
          <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-[1001] max-h-60 overflow-y-auto rounded-xl border border-outline-variant bg-surface-container-lowest shadow-lg">
            {showLoading && <p className="px-3 py-2.5 text-sm text-on-surface-variant">Mencari...</p>}
            {showEmpty && (
              <div className="px-3 py-2.5 text-sm text-on-surface-variant space-y-1">
                <p>Tidak ditemukan, coba kata kunci lain.</p>
                <p className="text-xs opacity-85">
                  Coba cari area yang lebih umum dulu (kelurahan/kecamatan), lalu koreksi
                  alamat lengkapnya di kolom Alamat di bawah setelah pilih lokasi.
                </p>
              </div>
            )}
            {showResults &&
              query.data?.map((result, i) => (
                <button
                  key={`${result.formatted}-${i}`}
                  type="button"
                  className="block w-full text-left px-3 py-2.5 text-sm text-on-surface bg-transparent hover:bg-primary/10 focus-visible:bg-primary/10 focus-visible:outline-none transition-colors"
                  onClick={() => handleSelect(result)}
                >
                  {result.formatted}
                </button>
              ))}
          </div>
        )}
      </div>
    </FormField>
  );
}
