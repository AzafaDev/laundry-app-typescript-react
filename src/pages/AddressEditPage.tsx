import { Link, useNavigate, useParams } from "react-router-dom";
import { useAddressQuery } from "../hooks/addresses/useAddressQuery";
import { AddressForm } from "../components/address/AddressForm";
import "../styles/auth.css";

export function AddressEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addressQuery = useAddressQuery(id);

  if (addressQuery.isLoading) {
    return (
      <div className="address-page">
        <div className="address-page-header">
          <h1>Edit Alamat</h1>
        </div>
        <div className="address-skeleton" />
      </div>
    );
  }

  if (addressQuery.isError) {
    return (
      <div className="address-page">
        <div className="address-empty">
          <p>Alamat tidak ditemukan</p>
          <Link to="/addresses" className="auth-button">Kembali ke daftar alamat</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="address-page">
      <div className="address-page-header">
        <h1>Edit Alamat</h1>
        <Link to="/addresses" className="auth-toggle">BATAL</Link>
      </div>
      <AddressForm initialData={addressQuery.data} onSuccess={() => navigate("/addresses")} />
    </div>
  );
}
