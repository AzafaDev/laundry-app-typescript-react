import { Link } from "react-router-dom";
import { useAddressesQuery } from "../hooks/addresses/useAddressesQuery";
import { AddressCard } from "../components/address/AddressCard";
import "../styles/auth.css";

export function Addresses() {
  const addressesQuery = useAddressesQuery();

  if (addressesQuery.isLoading) {
    return (
      <div className="address-page">
        <div className="address-page-header">
          <h1>Alamat</h1>
        </div>
        <div className="address-list">
          <div className="address-skeleton" />
          <div className="address-skeleton" />
        </div>
      </div>
    );
  }

  if (addressesQuery.data?.length === 0) {
    return (
      <div className="address-page">
        <div className="address-empty">
          <p>Belum ada alamat tersimpan</p>
          <Link to="/addresses/new" className="auth-button">Tambah Alamat Baru</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="address-page">
      <div className="address-page-header">
        <h1>Alamat</h1>
        <Link to="/addresses/new" className="auth-toggle">TAMBAH ALAMAT</Link>
      </div>
      <div className="address-list">
        {addressesQuery.data?.map((address) => (
          <AddressCard key={address.id} address={address} />
        ))}
      </div>
    </div>
  );
}
