import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { outletSchema, type OutletFormValues } from "../../schemas/outlet";
import type { OutletRequestData } from "../../api/outlets";
import type { Outlet } from "../../types/outlet";
import { useOutletQuery } from "../../hooks/outlets/useOutletQuery";
import { useCreateOutletMutation } from "../../hooks/outlets/useCreateOutletMutation";
import { useUpdateOutletMutation } from "../../hooks/outlets/useUpdateOutletMutation";
import { AddressAutocomplete } from "../../components/address/AddressAutocomplete";
import { AddressMap } from "../../components/address/AddressMap";
import { useStaffGeocodeSearchQuery } from "../../hooks/geocode/useStaffGeocodeSearchQuery";
import { FormField } from "../../components/FormField";
import { ApiErrorMessage } from "../../components/ApiErrorMessage";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { inputClasses } from "../../components/ui/Input";
import { BackLink } from "../../components/ui/BackLink";

interface OutletFormFieldsProps {
  initialData?: Outlet;
  onSuccess: () => void;
}

function OutletFormFields({ initialData, onSuccess }: OutletFormFieldsProps) {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<OutletFormValues>({
    resolver: zodResolver(outletSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          address: initialData.address,
          latitude: initialData.latitude,
          longitude: initialData.longitude,
          is_active: initialData.is_active,
          service_radius_km: initialData.service_radius_km,
        }
      : { is_active: true, service_radius_km: 10 },
  });

  const createMutation = useCreateOutletMutation();
  const updateMutation = useUpdateOutletMutation();
  const mutation = isEdit ? updateMutation : createMutation;

  const handleAutocompleteSelect = (result: { formatted: string; latitude: number; longitude: number }) => {
    setValue("address", result.formatted);
    setValue("latitude", result.latitude);
    setValue("longitude", result.longitude);
    trigger(["address", "latitude", "longitude"]);
  };

  const handleMapChange = (lat: number, lng: number) => {
    // Batch both writes, then validate once against the fully-updated
    // snapshot — same reasoning as AddressForm's handleMapChange: per-call
    // shouldValidate would run the cross-field lat/lng check against a
    // partially-updated state between the two setValue calls.
    setValue("latitude", lat);
    setValue("longitude", lng);
    trigger(["latitude", "longitude"]);
  };

  const onSubmit = (values: OutletFormValues) => {
    const payload: OutletRequestData = {
      name: values.name,
      address: values.address,
      latitude: values.latitude!,
      longitude: values.longitude!,
      is_active: values.is_active,
      service_radius_km: values.service_radius_km,
    };

    if (isEdit) {
      updateMutation.mutate({ id: initialData!.id, data: payload }, { onSuccess });
    } else {
      createMutation.mutate(payload, { onSuccess });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Nama" htmlFor="name" error={errors.name?.message}>
        <input id="name" className={inputClasses} {...register("name")} />
      </FormField>

      <AddressAutocomplete useSearchQuery={useStaffGeocodeSearchQuery} onSelect={handleAutocompleteSelect} />

      <FormField label="Alamat" htmlFor="address" error={errors.address?.message}>
        <input id="address" className={inputClasses} {...register("address")} />
      </FormField>

      <AddressMap
        value={{ latitude: watch("latitude"), longitude: watch("longitude") }}
        onChange={handleMapChange}
      />
      {errors.latitude && <p className="text-xs text-error">{errors.latitude.message}</p>}

      <FormField
        label="Radius jangkauan (km)"
        htmlFor="service_radius_km"
        hint="Jarak maksimum dari outlet ini yang masih otomatis dilayani saat pelanggan membuat pesanan"
        error={errors.service_radius_km?.message}
      >
        <input
          id="service_radius_km"
          className={inputClasses}
          type="number"
          step="0.1"
          min="0.1"
          {...register("service_radius_km", { valueAsNumber: true })}
        />
      </FormField>

      <div className="flex items-center gap-2">
        <input id="is_active" type="checkbox" {...register("is_active")} />
        <label htmlFor="is_active" className="text-sm text-on-surface">Outlet aktif</label>
      </div>

      <ApiErrorMessage error={mutation.error} />

      <Button type="submit" isLoading={mutation.isPending} fullWidth>
        {isEdit ? "Simpan perubahan" : "Tambah outlet"}
      </Button>
    </form>
  );
}

export function OutletForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const outletQuery = useOutletQuery(id);

  const handleSuccess = () => navigate("/staff/admin/outlets");

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <BackLink to="/staff/admin/outlets">Kembali ke daftar outlet</BackLink>
      <h1 className="text-2xl font-bold text-on-surface">{isEdit ? "Ubah Outlet" : "Tambah Outlet"}</h1>
      <Card>
        {isEdit && outletQuery.isLoading ? (
          <p>Memuat...</p>
        ) : isEdit && outletQuery.isError ? (
          <p>Outlet tidak ditemukan.</p>
        ) : (
          <OutletFormFields initialData={outletQuery.data} onSuccess={handleSuccess} />
        )}
      </Card>
    </main>
  );
}
