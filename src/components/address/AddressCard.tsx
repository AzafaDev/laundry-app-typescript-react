import { Link } from "react-router-dom";
import type { Address } from "../../types/address";
import { useDeleteAddressMutation } from "../../hooks/addresses/useDeleteAddressMutation";
import { useSetPrimaryAddressMutation } from "../../hooks/addresses/useSetPrimaryAddressMutation";
import { Card } from "../ui/Card";

const toggleClasses = "text-xs font-bold uppercase tracking-[0.06em] text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline";

interface AddressCardProps {
  address: Address;
}

export function AddressCard({ address }: AddressCardProps) {
  const deleteMutation = useDeleteAddressMutation();
  const setPrimaryMutation = useSetPrimaryAddressMutation();

  const handleDelete = () => {
    const message = address.is_primary
      ? "Alamat ini adalah alamat utama. Alamat lain akan otomatis jadi utama. Yakin hapus?"
      : "Yakin hapus alamat ini?";

    if (window.confirm(message)) {
      deleteMutation.mutate(address.id);
    }
  };

  const handleSetPrimary = () => {
    setPrimaryMutation.mutate(address.id);
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
        <span className="text-sm font-bold text-on-surface">{address.label}</span>
        {address.is_primary && (
          <span className="inline-block rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.04em] text-on-primary">
            Utama
          </span>
        )}
      </div>

      <p className="text-sm text-on-surface-variant mb-3">
        {address.address}, {address.district}, {address.city}, {address.province}
        {address.postal_code ? ` ${address.postal_code}` : ""}
      </p>

      <div className="flex flex-wrap gap-x-4 gap-y-2.5">
        <Link to={`/addresses/${address.id}/edit`} className={toggleClasses}>EDIT</Link>

        {!address.is_primary && (
          <button
            type="button"
            className={toggleClasses}
            onClick={handleSetPrimary}
            disabled={setPrimaryMutation.isPending}
          >
            {setPrimaryMutation.isPending ? "MENJADIKAN UTAMA..." : "JADIKAN UTAMA"}
          </button>
        )}

        <button
          type="button"
          className={`${toggleClasses} text-error`}
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? "MENGHAPUS..." : "HAPUS"}
        </button>
      </div>
    </Card>
  );
}
