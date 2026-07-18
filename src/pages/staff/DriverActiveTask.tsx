import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Loader2, MapPin, Package, Truck } from "lucide-react";
import toast from "react-hot-toast";
import { useActiveTaskQuery } from "../../hooks/driver/useActiveTaskQuery";
import { useCompleteTaskMutation } from "../../hooks/driver/useCompleteTaskMutation";
import { ApiErrorMessage } from "../../components/ApiErrorMessage";
import "../../styles/auth.css";

export function DriverActiveTask() {
  const activeTaskQuery = useActiveTaskQuery();
  const completeMutation = useCompleteTaskMutation();

  const task = activeTaskQuery.data?.data;

  const handleComplete = () => {
    if (!task) return;
    completeMutation.mutate(task.id, {
      onSuccess: () => toast.success("Task berhasil diselesaikan"),
    });
  };

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <Link to="/staff/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke dashboard
      </Link>

      <h1 className="text-2xl font-bold text-on-surface">Task Aktif</h1>

      <ApiErrorMessage error={activeTaskQuery.error ?? completeMutation.error} />

      {activeTaskQuery.isLoading && <p className="text-sm text-on-surface-variant">Memuat...</p>}

      {!activeTaskQuery.isLoading && !task && (
        <div className="rounded-2xl border border-dashed border-outline-variant bg-surface px-6 py-12 text-center space-y-3">
          <MapPin className="w-6 h-6 text-outline mx-auto" />
          <p className="text-sm text-on-surface-variant">Kamu belum punya task aktif.</p>
          <Link to="/staff/driver/tasks" className="inline-flex items-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary/90 transition-colors">
            Lihat task tersedia
          </Link>
        </div>
      )}

      {task && (
        <div className="rounded-2xl border border-outline-variant bg-surface p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              {task.task_type === "pickup" ? <Package className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface">{task.invoice_number}</p>
              <p className="text-xs text-on-surface-variant">
                {task.task_type === "pickup" ? "Jemput dari customer" : "Antar ke customer"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleComplete}
            disabled={completeMutation.isPending}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-on-primary hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {completeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {completeMutation.isPending ? "Memproses..." : "Selesaikan Task"}
          </button>
        </div>
      )}
    </main>
  );
}
