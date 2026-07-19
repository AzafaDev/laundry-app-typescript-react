import { Link } from "react-router-dom";
import { CheckCircle2, Loader2, MapPin, Package, Truck } from "lucide-react";
import toast from "react-hot-toast";
import { useActiveTaskQuery } from "../../hooks/driver/useActiveTaskQuery";
import { useCompleteTaskMutation } from "../../hooks/driver/useCompleteTaskMutation";
import { ApiErrorMessage } from "../../components/ApiErrorMessage";
import { BackLink } from "../../components/ui/BackLink";
import { Card } from "../../components/ui/Card";
import { LoadingState, EmptyState } from "../../components/ui/PageState";
import { buttonClasses } from "../../components/ui/buttonStyles";

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
      <BackLink to="/staff/dashboard">Kembali ke dashboard</BackLink>

      <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Task Aktif</h1>

      <ApiErrorMessage error={activeTaskQuery.error ?? completeMutation.error} />

      {activeTaskQuery.isLoading && <LoadingState label="Memuat task aktif..." />}

      {!activeTaskQuery.isLoading && !task && (
        <EmptyState
          icon={MapPin}
          title="Belum ada task aktif"
          description="Ambil task dari daftar yang tersedia untuk mulai bekerja."
          tone="primary"
          action={
            <Link to="/staff/driver/tasks" className={buttonClasses("primary", "md")}>
              Lihat task tersedia
            </Link>
          }
        />
      )}

      {task && (
        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              {task.task_type === "pickup" ? <Package className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
            </div>
            <div>
              <p className="font-mono text-sm font-bold text-on-surface">{task.invoice_number}</p>
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
        </Card>
      )}
    </main>
  );
}
