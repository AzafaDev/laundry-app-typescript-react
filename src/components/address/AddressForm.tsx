import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressFormValues } from "../../schemas/address";
import type { Address } from "../../types/address";
import type { AddressRequestData } from "../../api/addresses";
import { useCreateAddressMutation } from "../../hooks/addresses/useCreateAddressMutation";
import { useUpdateAddressMutation } from "../../hooks/addresses/useUpdateAddressMutation";
import { useAddressesQuery } from "../../hooks/addresses/useAddressesQuery";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { AddressMap } from "./AddressMap";
import { WilayahSelect, type WilayahValue } from "./WilayahSelect";
import { FormField } from "../FormField";
import { ApiErrorMessage } from "../ApiErrorMessage";
import { Button } from "../ui/Button";
import { inputClasses } from "../ui/Input";

interface AddressFormProps {
  initialData?: Address;
  onSuccess?: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

export function AddressForm({ initialData, onSuccess, onDirtyChange }: AddressFormProps) {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isDirty },
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

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const wilayahValue: WilayahValue = {
    provinceId: watch("province_id"),
    cityId: watch("city_id"),
    districtId: watch("district_id"),
  };

  const handleWilayahChange = (next: WilayahValue) => {
    setValue("province_id", next.provinceId, { shouldValidate: true, shouldDirty: true });
    setValue("city_id", next.cityId, { shouldValidate: true, shouldDirty: true });
    setValue("district_id", next.districtId, { shouldValidate: true, shouldDirty: true });
  };

  const handleAutocompleteSelect = (result: { formatted: string; latitude: number; longitude: number }) => {
    // Write all three values first (no per-call validation), then trigger
    // validation once at the end. Validating after each individual setValue
    // would run the cross-field lat/lng check against a partially-updated
    // snapshot (e.g. latitude set but longitude not yet), incorrectly
    // re-adding the error on "latitude" right before the next call could
    // otherwise clear it.
    setValue("address", result.formatted, { shouldDirty: true });
    setValue("latitude", result.latitude, { shouldDirty: true });
    setValue("longitude", result.longitude, { shouldDirty: true });
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

  const handleMapChange = (lat: number, lng: number) => {
    // Same reasoning and same batched-write-then-single-trigger pattern as
    // handleAutocompleteSelect above: a manually placed/dragged pin has the
    // same "no reliable link to our wilayah IDs" problem a new search
    // result does, and the two lat/lng fields must be validated together
    // against a fully-updated snapshot, not one-at-a-time.
    setValue("latitude", lat, { shouldDirty: true });
    setValue("longitude", lng, { shouldDirty: true });
    trigger(["latitude", "longitude"]);
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
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Label" htmlFor="label" error={errors.label?.message}>
        <input id="label" className={inputClasses} {...register("label")} />
      </FormField>

      <AddressAutocomplete onSelect={handleAutocompleteSelect} />
      <AddressMap
        value={{ latitude: watch("latitude"), longitude: watch("longitude") }}
        onChange={handleMapChange}
      />
      {errors.latitude && <p role="alert" className="text-xs text-error">{errors.latitude.message}</p>}

      <FormField label="Alamat" htmlFor="address" error={errors.address?.message}>
        <input id="address" className={inputClasses} {...register("address")} />
      </FormField>

      <WilayahSelect
        value={wilayahValue}
        onChange={handleWilayahChange}
        provinceError={errors.province_id?.message}
        cityError={errors.city_id?.message}
        districtError={errors.district_id?.message}
      />

      <FormField label="Kode pos" htmlFor="postal_code">
        <input id="postal_code" className={inputClasses} {...register("postal_code")} />
      </FormField>

      {!isFirstAddress && (
        <div className="flex items-center gap-2">
          <input
            id="is_primary"
            type="checkbox"
            className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/30"
            {...register("is_primary")}
            disabled={isPrimaryLocked}
          />
          <label htmlFor="is_primary" className="text-sm text-on-surface">Jadikan alamat utama</label>
        </div>
      )}

      <ApiErrorMessage error={mutation.error} />

      <Button type="submit" fullWidth isLoading={mutation.isPending}>
        {mutation.isPending ? "Menyimpan..." : isEdit ? "Simpan perubahan" : "Tambah alamat"}
      </Button>
    </form>
  );
}
