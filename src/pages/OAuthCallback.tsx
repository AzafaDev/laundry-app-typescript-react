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
          <h2>Signing you in...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h2>Google sign-in failed</h2>
        <p>Something went wrong while signing in with Google.</p>
        <Link to="/login" className="auth-button">Back to login</Link>
      </div>
    </div>
  );
}
