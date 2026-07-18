import { useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { googleLoginUrl } from "../api/auth";
import { LinkButton } from "../components/ui/Button";
import { buttonClasses } from "../components/ui/buttonStyles";
import { AuthShell, AuthCard } from "../components/ui/AuthShell";

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
      <AuthShell>
        <AuthCard className="flex flex-col items-center text-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <h2 className="text-xl font-bold text-on-surface">Sedang memproses masuk...</h2>
        </AuthCard>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <AuthCard className="text-center">
        <h2 className="text-xl font-bold text-on-surface">Masuk dengan Google gagal</h2>
        <p className="text-sm text-on-surface-variant">Ada masalah saat masuk dengan Google.</p>
        <LinkButton href={googleLoginUrl()} fullWidth>Coba lagi dengan Google</LinkButton>
        <Link to="/login" className={buttonClasses("secondary", "md", "w-full")}>Kembali ke halaman masuk</Link>
      </AuthCard>
    </AuthShell>
  );
}
