import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, ImagePlus, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateComplaintMutation } from "../../hooks/orders/useCreateComplaintMutation";
import type { ComplaintType } from "../../types/order";
import { MAX_COMPLAINT_PHOTOS, createComplaintSchema, type CreateComplaintFormValues } from "../../schemas/complaint";
import { ApiErrorMessage } from "../ApiErrorMessage";
import "../../styles/auth.css";

interface Props {
  orderId: string;
  onClose: () => void;
}

const COMPLAINT_TYPE_OPTIONS: { value: ComplaintType; label: string }[] = [
  { value: "missing_item", label: "Item hilang" },
  { value: "damaged_item", label: "Item rusak" },
  { value: "wrong_item", label: "Item tertukar" },
  { value: "late_delivery", label: "Pengantaran terlambat" },
  { value: "quality_issue", label: "Kualitas cuci kurang baik" },
  { value: "other", label: "Lainnya" },
];

// The parent only mounts this component while the modal should be open (see
// OrderDetail.tsx: `{complaintOpen && <ComplaintModal ... />}`), so a fresh
// mount already gives fresh initial state — no reset-on-open effect needed.
export function ComplaintModal({ orderId, onClose }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mutation = useCreateComplaintMutation();

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateComplaintFormValues>({
    resolver: zodResolver(createComplaintSchema),
    defaultValues: { complaint_type: "missing_item", description: "", photos: [] },
  });

  const description = watch("description");
  const photos = watch("photos");

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Derived directly from `photos` (createObjectURL is a pure, synchronous
  // mapping given the same File), so no effect/state is needed to produce
  // it — only cleanup needs an effect, once URLs actually change.
  const previewUrls = useMemo(() => photos.map((file) => URL.createObjectURL(file)), [photos]);
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (selected.length === 0) return;
    // Merge unconditionally and let the zod schema (count/size/type) be the
    // single source of truth for what's rejected — its message then surfaces
    // through the same `errors.photos` path as any other validation error.
    setValue("photos", [...photos, ...selected], { shouldValidate: true });
  };

  const removePhoto = (index: number) => {
    setValue(
      "photos",
      photos.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

  const onSubmit = (values: CreateComplaintFormValues) => {
    mutation.mutate(
      { orderId, data: values },
      {
        onSuccess: () => {
          toast.success("Komplain berhasil dikirim");
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[10px]">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-outline-variant flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-error" />
            Ajukan Komplain
          </h2>
          <button onClick={onClose} className="text-on-surface-variant hover:bg-surface-container-high rounded-full p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="space-y-1">
            <label className="text-sm font-bold text-on-surface">Jenis Komplain</label>
            <select
              className="w-full bg-white border border-outline-variant rounded-lg p-3 text-sm focus:border-primary"
              {...register("complaint_type")}
            >
              {COMPLAINT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-on-surface">Deskripsi</label>
            <textarea
              className="w-full bg-white border border-outline-variant rounded-lg p-3 text-sm h-28 focus:border-primary"
              placeholder="Jelaskan kendala yang kamu alami..."
              {...register("description")}
            />
            {errors.description && <p className="text-xs text-error">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface">Foto (opsional, maks {MAX_COMPLAINT_PHOTOS})</label>
            <div className="flex flex-wrap gap-2">
              {previewUrls.map((url, index) => (
                <div key={url} className="relative w-16 h-16 rounded-lg overflow-hidden border border-outline-variant">
                  <img src={url} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5 text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {photos.length < MAX_COMPLAINT_PHOTOS && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 rounded-lg border-2 border-dashed border-outline-variant flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
                >
                  <ImagePlus className="w-5 h-5" />
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFilesSelected}
              className="hidden"
            />
            {errors.photos && <p className="text-xs text-error">{errors.photos.message}</p>}
          </div>

          <ApiErrorMessage error={mutation.error} />
        </div>

        <div className="p-6 bg-surface-container-low flex gap-4 shrink-0">
          <button
            onClick={onClose}
            disabled={mutation.isPending}
            className="flex-1 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high rounded-lg disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={mutation.isPending || description.trim().length === 0}
            className="flex-1 py-2 text-sm font-bold bg-primary text-on-primary rounded-lg shadow-sm hover:opacity-90 active:scale-95 disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Kirim Komplain
          </button>
        </div>
      </div>
    </div>
  );
}
