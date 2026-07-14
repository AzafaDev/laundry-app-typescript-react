import { Link, useNavigate } from "react-router-dom";
import { AddressForm } from "../components/address/AddressForm";
import "../styles/auth.css";

export function AddressCreatePage() {
  const navigate = useNavigate();

  return (
    <div className="address-page">
      <div className="address-page-header">
        <h1>Tambah Alamat</h1>
        <Link to="/addresses" className="auth-toggle">BATAL</Link>
      </div>
      <AddressForm onSuccess={() => navigate("/addresses")} />
    </div>
  );
}
