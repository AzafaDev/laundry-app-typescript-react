import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressFormValues } from "../schemas/address";
import type { Address } from "../types/address";
import type { AddressRequestData } from "../api/addresses";
import { useCreateAddressMutation } from "../hooks/addresses/useCreateAddressMutation";
import { useUpdateAddressMutation } from "../hooks/addresses/useUpdateAddressMutation";
import { useAddressesQuery } from "../hooks/addresses/useAddressesQuery";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { WilayahSelect, type WilayahValue } from "./WilayahSelect";
import { FormField } from "./FormField";
import { ApiErrorMessage } from "./ApiErrorMessage";

interface AddressFormProps {
  initialData?: Address;
  onSuccess?: () => void;
}

export function AddressForm({ initialData, onSuccess }: AddressFormProps) {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialData
      ? {
          label: initialData.label,
          address: initialData.address,
          province_id: initialData.province_id,
          city_id: initialData.city_id,
          district_id: initialData.district_id,
          postal_code: initialData.postal_code,
          latitude: initialData.latitude,
          longitude: initialData.longitude,
          is_primary: initialData.is_primary,
        }
      : {
          is_primary: false,
        },
  });

  const createMutation = useCreateAddressMutation();
  const updateMutation = useUpdateAddressMutation();
  const addressesQuery = useAddressesQuery();
  const mutation = isEdit ? updateMutation : createMutation;

  const isFirstAddress = !isEdit && addressesQuery.data?.length === 0;
  const isPrimaryLocked = isEdit && initialData!.is_primary;

  const wilayahValue: WilayahValue = {
    provinceId: watch("province_id"),
    cityId: watch("city_id"),
    districtId: watch("district_id"),
  };

  const handleWilayahChange = (next: WilayahValue) => {
    setValue("province_id", next.provinceId, { shouldValidate: true });
    setValue("city_id", next.cityId, { shouldValidate: true });
    setValue("district_id", next.districtId, { shouldValidate: true });
  };

  const handleAutocompleteSelect = (result: { formatted: string; latitude: number; longitude: number }) => {
    // Write all three values first (no per-call validation), then trigger
    // validation once at the end. Validating after each individual setValue
    // would run the cross-field lat/lng check against a partially-updated
    // snapshot (e.g. latitude set but longitude not yet), incorrectly
    // re-adding the error on "latitude" right before the next call could
    // otherwise clear it.
    setValue("address", result.formatted);
    setValue("latitude", result.latitude);
    setValue("longitude", result.longitude);
    trigger(["address", "latitude", "longitude"]);

    // A new search result may point to a different region than whatever
    // province/city/district was previously selected (or prefilled in edit
    // mode) — there's no reliable way to tell whether it actually did, since
    // geocoding results aren't mapped to our internal wilayah IDs. Reset
    // unconditionally rather than risk silently saving a mismatched region.
    // Left unvalidated on purpose, matching WilayahSelect's own internal
    // resets — surfacing three new "required" errors immediately after a
    // helpful autocomplete pick would read as the form punishing the user.
    setValue("province_id", undefined);
    setValue("city_id", undefined);
    setValue("district_id", undefined);
  };

  const onSubmit = (values: AddressFormValues) => {
    const payload: AddressRequestData = {
      label: values.label,
      address: values.address,
      province_id: values.province_id!,
      city_id: values.city_id!,
      district_id: values.district_id!,
      postal_code: values.postal_code,
      latitude: values.latitude!,
      longitude: values.longitude!,
      is_primary: values.is_primary ?? false,
    };

    if (isEdit) {
      updateMutation.mutate(
        { id: initialData!.id, data: payload },
        { onSuccess: () => onSuccess?.() }
      );
    } else {
      createMutation.mutate(payload, { onSuccess: () => onSuccess?.() });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Label" htmlFor="label" error={errors.label?.message}>
        <div className="auth-input-wrap">
          <input id="label" className="auth-input" {...register("label")} />
        </div>
      </FormField>

      <AddressAutocomplete onSelect={handleAutocompleteSelect} />
      {errors.latitude && <p className="auth-error">{errors.latitude.message}</p>}

      <FormField label="Alamat" htmlFor="address" error={errors.address?.message}>
        <div className="auth-input-wrap">
          <input id="address" className="auth-input" {...register("address")} />
        </div>
      </FormField>

      <WilayahSelect
        value={wilayahValue}
        onChange={handleWilayahChange}
        provinceError={errors.province_id?.message}
        cityError={errors.city_id?.message}
        districtError={errors.district_id?.message}
      />

      <FormField label="Kode pos" htmlFor="postal_code">
        <div className="auth-input-wrap">
          <input id="postal_code" className="auth-input" {...register("postal_code")} />
        </div>
      </FormField>

      {!isFirstAddress && (
        <div className="auth-checkbox-row">
          <input
            id="is_primary"
            type="checkbox"
            {...register("is_primary")}
            disabled={isPrimaryLocked}
          />
          <label htmlFor="is_primary">Jadikan alamat utama</label>
        </div>
      )}

      <ApiErrorMessage error={mutation.error} />

      <button className="auth-button" type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Menyimpan..." : isEdit ? "Simpan perubahan" : "Tambah alamat"}
      </button>
    </form>
  );
}
