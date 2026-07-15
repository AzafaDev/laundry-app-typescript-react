import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import "../../styles/auth.css";
import "../../styles/admin.css";

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
        }
      : { is_active: true },
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
        <div className="auth-input-wrap">
          <input id="name" className="auth-input" {...register("name")} />
        </div>
      </FormField>

      <AddressAutocomplete useSearchQuery={useStaffGeocodeSearchQuery} onSelect={handleAutocompleteSelect} />

      <FormField label="Alamat" htmlFor="address" error={errors.address?.message}>
        <div className="auth-input-wrap">
          <input id="address" className="auth-input" {...register("address")} />
        </div>
      </FormField>

      <AddressMap
        value={{ latitude: watch("latitude"), longitude: watch("longitude") }}
        onChange={handleMapChange}
      />
      {errors.latitude && <p className="auth-error">{errors.latitude.message}</p>}

      <div className="auth-checkbox-row">
        <input id="is_active" type="checkbox" {...register("is_active")} />
        <label htmlFor="is_active">Outlet aktif</label>
      </div>

      <ApiErrorMessage error={mutation.error} />

      <button className="auth-button" type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Menyimpan..." : isEdit ? "Simpan perubahan" : "Tambah outlet"}
      </button>
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
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>{isEdit ? "Ubah Outlet" : "Tambah Outlet"}</h1>
        <Link to="/staff/admin/outlets" className="auth-toggle">BATAL</Link>
      </div>

      {isEdit && outletQuery.isLoading ? (
        <p>Memuat...</p>
      ) : isEdit && outletQuery.isError ? (
        <p>Outlet tidak ditemukan.</p>
      ) : (
        <OutletFormFields initialData={outletQuery.data} onSuccess={handleSuccess} />
      )}
    </div>
  );
}
