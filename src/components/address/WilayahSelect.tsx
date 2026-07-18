import type { ChangeEvent } from "react";
import { useProvincesQuery } from "../../hooks/wilayah/useProvincesQuery";
import { useCitiesQuery } from "../../hooks/wilayah/useCitiesQuery";
import { useDistrictsQuery } from "../../hooks/wilayah/useDistrictsQuery";
import { FormField } from "../FormField";
import { inputClasses } from "../ui/Input";

export interface WilayahValue {
  provinceId?: number;
  cityId?: number;
  districtId?: number;
}

interface WilayahSelectProps {
  value: WilayahValue;
  onChange: (next: WilayahValue) => void;
  provinceError?: string;
  cityError?: string;
  districtError?: string;
}

export function WilayahSelect({ value, onChange, provinceError, cityError, districtError }: WilayahSelectProps) {
  const provincesQuery = useProvincesQuery();
  const citiesQuery = useCitiesQuery(value.provinceId);
  const districtsQuery = useDistrictsQuery(value.cityId);

  const handleProvinceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value ? Number(e.target.value) : undefined;
    onChange({ provinceId, cityId: undefined, districtId: undefined });
  };

  const handleCityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value ? Number(e.target.value) : undefined;
    onChange({ ...value, cityId, districtId: undefined });
  };

  const handleDistrictChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value ? Number(e.target.value) : undefined;
    onChange({ ...value, districtId });
  };

  const cityDisabled = !value.provinceId || citiesQuery.isLoading;
  const districtDisabled = !value.cityId || districtsQuery.isLoading;

  const cityPlaceholder = !value.provinceId
    ? "Pilih provinsi dulu"
    : citiesQuery.isLoading
      ? "Memuat..."
      : "Pilih kota";

  const districtPlaceholder = !value.cityId
    ? "Pilih kota dulu"
    : districtsQuery.isLoading
      ? "Memuat..."
      : "Pilih kecamatan";

  return (
    <>
      <FormField label="Provinsi" htmlFor="province_id" error={provinceError}>
        <select
          id="province_id"
          className={inputClasses}
          value={value.provinceId ?? ""}
          onChange={handleProvinceChange}
        >
          <option value="">Pilih provinsi</option>
          {provincesQuery.data?.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Kota" htmlFor="city_id" error={cityError}>
        <select
          id="city_id"
          className={inputClasses}
          value={value.cityId ?? ""}
          onChange={handleCityChange}
          disabled={cityDisabled}
        >
          <option value="">{cityPlaceholder}</option>
          {citiesQuery.data?.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Kecamatan" htmlFor="district_id" error={districtError}>
        <select
          id="district_id"
          className={inputClasses}
          value={value.districtId ?? ""}
          onChange={handleDistrictChange}
          disabled={districtDisabled}
        >
          <option value="">{districtPlaceholder}</option>
          {districtsQuery.data?.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </FormField>
    </>
  );
}
