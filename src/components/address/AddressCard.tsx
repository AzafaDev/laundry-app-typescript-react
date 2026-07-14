import { Link } from "react-router-dom";
import type { Address } from "../../types/address";
import { useDeleteAddressMutation } from "../../hooks/addresses/useDeleteAddressMutation";
import { useSetPrimaryAddressMutation } from "../../hooks/addresses/useSetPrimaryAddressMutation";

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
    <div className="address-card">
      <div className="address-card-top">
        <span className="address-card-label">{address.label}</span>
        {address.is_primary && <span className="address-badge">Utama</span>}
      </div>

      <p className="address-card-text">
        {address.address}, {address.district}, {address.city}, {address.province}
        {address.postal_code ? ` ${address.postal_code}` : ""}
      </p>

      <div className="address-actions">
        <Link to={`/addresses/${address.id}/edit`} className="auth-toggle">EDIT</Link>

        {!address.is_primary && (
          <button
            type="button"
            className="auth-toggle"
            onClick={handleSetPrimary}
            disabled={setPrimaryMutation.isPending}
          >
            {setPrimaryMutation.isPending ? "MENJADIKAN UTAMA..." : "JADIKAN UTAMA"}
          </button>
        )}

        <button
          type="button"
          className="auth-toggle auth-toggle-danger"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? "MENGHAPUS..." : "HAPUS"}
        </button>
      </div>
    </div>
  );
}
