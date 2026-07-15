import { useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import "../styles/auth.css";

export function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success") === "true";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (success) {
      queryClient.invalidateQueries({ queryKey: ["profile"] }).then(() => {
        navigate("/", { replace: true });
      });
    }
  }, [success, navigate, queryClient]);

  if (success) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <h2>Sedang memproses masuk...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h2>Masuk dengan Google gagal</h2>
        <p>Ada masalah saat masuk dengan Google.</p>
        <Link to="/login" className="auth-button">Kembali ke halaman masuk</Link>
      </div>
    </div>
  );
}
