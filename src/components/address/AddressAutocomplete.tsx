import { useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useGeocodeSearchQuery } from "../../hooks/geocode/useGeocodeSearchQuery";
import type { GeocodeResult } from "../../types/geocode";
import { FormField } from "../FormField";

interface AddressAutocompleteProps {
  onSelect: (result: GeocodeResult) => void;
  placeholder?: string;
}

export function AddressAutocomplete({ onSelect, placeholder }: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebouncedValue(inputValue, 400);
  const query = useGeocodeSearchQuery(debouncedQuery);

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
      <div className="autocomplete-wrap" ref={wrapRef}>
        <input
          id="address_autocomplete"
          className="auth-input"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          autoComplete="off"
        />

        {isOpen && (
          <div className="autocomplete-dropdown">
            {showLoading && <p className="autocomplete-status">Mencari...</p>}
            {showEmpty && (
              <div className="autocomplete-status">
                <p>Tidak ditemukan, coba kata kunci lain.</p>
                <p>
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
                  className="autocomplete-option"
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
