import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, Loader2, Package, Truck } from "lucide-react";
import toast from "react-hot-toast";
import { useAvailablePickupsQuery } from "../../hooks/driver/useAvailablePickupsQuery";
import { useAvailableDeliveriesQuery } from "../../hooks/driver/useAvailableDeliveriesQuery";
import { useActiveTaskQuery } from "../../hooks/driver/useActiveTaskQuery";
import { useClaimTaskMutation } from "../../hooks/driver/useClaimTaskMutation";
import { ApiErrorMessage } from "../../components/ApiErrorMessage";
import { BackLink } from "../../components/ui/BackLink";
import { LoadingState, EmptyState } from "../../components/ui/PageState";
import type { DriverTaskType } from "../../types/driver";

const TAB_LABEL: Record<DriverTaskType, string> = { pickup: "Pickup", delivery: "Delivery" };

export function DriverTasks() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<DriverTaskType>("pickup");
  const activeTaskQuery = useActiveTaskQuery();
  const hasActiveTask = !!activeTaskQuery.data?.data;

  const pickupsQuery = useAvailablePickupsQuery(tab === "pickup" && !hasActiveTask);
  const deliveriesQuery = useAvailableDeliveriesQuery(tab === "delivery" && !hasActiveTask);
  const claimMutation = useClaimTaskMutation();

  const query = tab === "pickup" ? pickupsQuery : deliveriesQuery;
  const tasks = query.data?.data ?? [];

  const handleClaim = (taskId: string) => {
    claimMutation.mutate(taskId, {
      onSuccess: () => {
        toast.success("Task berhasil diklaim");
        navigate("/staff/driver/active");
      },
    });
  };

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <BackLink to="/staff/dashboard">Kembali ke dashboard</BackLink>

      <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Task Tersedia</h1>

      {hasActiveTask && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-tertiary/30 bg-tertiary-container px-4 py-3 text-sm text-on-tertiary-container">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            Kamu masih punya task aktif.{" "}
            <Link to="/staff/driver/active" className="font-semibold underline">
              Lihat task aktif
            </Link>{" "}
            sebelum mengambil task baru.
          </p>
        </div>
      )}

      <div className="flex gap-2">
        {(["pickup", "delivery"] as DriverTaskType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-colors ${
              tab === t ? "border-primary bg-primary/5 text-primary" : "border-outline-variant text-on-surface-variant"
            }`}
          >
            {TAB_LABEL[t]}
          </button>
        ))}
      </div>

      <ApiErrorMessage error={query.error ?? claimMutation.error} />

      {query.isLoading && <LoadingState label="Memuat task..." />}

      {!query.isLoading && !hasActiveTask && tasks.length === 0 && (
        <EmptyState
          icon={tab === "pickup" ? Package : Truck}
          title={`Belum ada task ${TAB_LABEL[tab].toLowerCase()}`}
          description="Task baru akan muncul di sini begitu tersedia."
        />
      )}

      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-2xl border border-outline-variant bg-surface p-4 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-sm font-bold text-on-surface truncate">{task.invoice_number}</p>
              {task.distance_km !== undefined && (
                <p className="text-xs text-on-surface-variant">{task.distance_km} km dari outlet</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleClaim(task.id)}
              disabled={claimMutation.isPending || hasActiveTask}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-on-primary hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
            >
              {claimMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Ambil
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
