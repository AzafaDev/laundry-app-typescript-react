import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, MapPin, Truck } from "lucide-react";
import toast from "react-hot-toast";
import { useAddressesQuery } from "../hooks/addresses/useAddressesQuery";
import { useCreateOrderMutation } from "../hooks/orders/useCreateOrderMutation";
import { createOrderSchema, type CreateOrderFormValues } from "../schemas/order";
import { ApiErrorMessage } from "../components/ApiErrorMessage";
import { BackLink } from "../components/ui/BackLink";

const getTodayDateKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

const PICKUP_DATES = Array.from({ length: 7 }, (_, offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const label = offset === 0 ? "Hari ini" : date.toLocaleDateString("id-ID", { weekday: "short" });
  return { key, label, day: date.toLocaleDateString("id-ID", { day: "2-digit" }), month: date.toLocaleDateString("id-ID", { month: "short" }) };
});

export function Pickup() {
  const addressesQuery = useAddressesQuery();
  const createOrderMutation = useCreateOrderMutation();

  const [successInvoice, setSuccessInvoice] = useState<string | null>(null);

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOrderFormValues>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: { pickup_address_id: "", pickup_date: getTodayDateKey() },
  });

  const addresses = addressesQuery.data ?? [];
  // Falls back to the primary (or first) address purely for display/submit
  // purposes until the user explicitly picks one — the RHF field itself
  // stays empty until either a click or submit-time writes to it, so no
  // effect is needed to seed it from data that arrives asynchronously.
  const defaultAddressId = addresses.find((a) => a.is_primary)?.id ?? addresses[0]?.id ?? null;
  const watchedAddressId = watch("pickup_address_id");
  const effectiveAddressId = watchedAddressId || defaultAddressId;
  const selectedDate = watch("pickup_date");

  const canOrder = !!effectiveAddressId && !addressesQuery.isLoading && !createOrderMutation.isPending && !successInvoice;

  const onSubmit = (values: CreateOrderFormValues) => {
    setSuccessInvoice(null);
    createOrderMutation.mutate(
      { pickup_address_id: values.pickup_address_id, pickup_date: values.pickup_date },
      {
        onSuccess: (order) => {
          setSuccessInvoice(order.invoice_number);
          toast.success("Pesanan pickup berhasil dibuat");
        },
      },
    );
  };

  const handleSubmitClick = () => {
    if (!watchedAddressId && defaultAddressId) {
      setValue("pickup_address_id", defaultAddressId, { shouldValidate: true });
    }
    void handleSubmit(onSubmit)();
  };

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-10 space-y-8">
      <div className="space-y-4">
        <BackLink to="/">Kembali ke beranda</BackLink>
        <div>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Pickup Laundry
          </span>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-on-surface">Pesan pickup laundry</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Pilih alamat penjemputan, lalu konfirmasi. Kurir kami akan segera datang.</p>
        </div>
      </div>

      <section className="rounded-3xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-on-surface">Pilih Alamat Pickup</h2>
            <p className="text-sm text-on-surface-variant">Kurir akan menjemput dari alamat ini.</p>
          </div>
        </div>

        {addressesQuery.isLoading && (
          <div className="flex items-center gap-3 rounded-2xl border border-outline-variant bg-surface px-4 py-5 text-sm text-on-surface-variant">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            Memuat alamat...
          </div>
        )}

        {!addressesQuery.isLoading && addresses.length === 0 && (
          <div className="rounded-2xl border border-dashed border-outline-variant bg-surface px-4 py-5 text-sm text-on-surface-variant">
            <p>Kamu belum punya alamat pickup. Tambahkan alamat dulu agar order bisa diproses.</p>
            <Link to="/addresses/new" className="mt-4 inline-flex items-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary/90 transition-colors">
              Tambah alamat pickup
            </Link>
          </div>
        )}

        {!addressesQuery.isLoading && addresses.length > 0 && (
          <div className="space-y-3">
            {addresses.map((address) => {
              const isSelected = address.id === effectiveAddressId;
              return (
                <button
                  key={address.id}
                  type="button"
                  onClick={() => setValue("pickup_address_id", address.id, { shouldValidate: true })}
                  className={`w-full text-left rounded-2xl border px-4 py-4 transition-all ${
                    isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-outline-variant bg-surface hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-on-surface">{address.label}</span>
                    {address.is_primary && (
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">Utama</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-on-surface-variant">{address.address}</p>
                  <p className="text-xs text-on-surface-variant">
                    {address.district}, {address.city}, {address.province}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm space-y-5">
        <h2 className="text-base font-bold text-on-surface">Jadwal Pickup</h2>
        <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory -mx-1 px-1 pb-1">
          {PICKUP_DATES.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => setValue("pickup_date", d.key, { shouldValidate: true })}
              className={`shrink-0 w-[76px] snap-start py-3 px-2 rounded-2xl border-2 text-center transition-all ${
                selectedDate === d.key ? "border-primary bg-primary/5" : "border-outline-variant bg-surface hover:border-primary/40"
              }`}
            >
              <span className="block text-xs font-bold uppercase text-on-surface-variant">{d.label}</span>
              <span className="block text-xl font-bold text-on-surface">{d.day}</span>
              <span className="block text-xs text-on-surface-variant">{d.month}</span>
            </button>
          ))}
        </div>
      </section>

      <ApiErrorMessage error={createOrderMutation.error} />
      {(errors.pickup_address_id || errors.pickup_date) && (
        <p className="text-xs text-error">
          {errors.pickup_address_id?.message ?? errors.pickup_date?.message}
        </p>
      )}
      {successInvoice && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-700 flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 w-4 h-4 shrink-0" />
          <div className="space-y-3">
            <p>Order {successInvoice} berhasil dibuat! Kurir akan segera menjemput laundry Anda.</p>
            <Link to="/orders" className="inline-flex items-center rounded-xl bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 transition-colors">
              Lihat progress pesanan
            </Link>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmitClick}
        disabled={!canOrder}
        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-bold text-on-primary hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {createOrderMutation.isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Memproses pickup...
          </>
        ) : (
          <>
            <Truck className="w-5 h-5" />
            Pesan Pickup Sekarang
          </>
        )}
      </button>
    </main>
  );
}
