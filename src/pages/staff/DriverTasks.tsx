import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Package, Truck } from "lucide-react";
import toast from "react-hot-toast";
import { useAvailablePickupsQuery } from "../../hooks/driver/useAvailablePickupsQuery";
import { useAvailableDeliveriesQuery } from "../../hooks/driver/useAvailableDeliveriesQuery";
import { useActiveTaskQuery } from "../../hooks/driver/useActiveTaskQuery";
import { useClaimTaskMutation } from "../../hooks/driver/useClaimTaskMutation";
import { ApiErrorMessage } from "../../components/ApiErrorMessage";
import type { DriverTaskType } from "../../types/driver";
import "../../styles/auth.css";

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
      <Link to="/staff/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke dashboard
      </Link>

      <h1 className="text-2xl font-bold text-on-surface">Task Tersedia</h1>

      {hasActiveTask && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Kamu masih punya task aktif.{" "}
          <Link to="/staff/driver/active" className="font-semibold underline">
            Lihat task aktif
          </Link>{" "}
          sebelum mengambil task baru.
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

      {query.isLoading && <p className="text-sm text-on-surface-variant">Memuat...</p>}
      {!query.isLoading && !hasActiveTask && tasks.length === 0 && (
        <div className="rounded-2xl border border-dashed border-outline-variant bg-surface px-6 py-12 text-center">
          {tab === "pickup" ? (
            <Package className="w-6 h-6 text-outline mx-auto mb-2" />
          ) : (
            <Truck className="w-6 h-6 text-outline mx-auto mb-2" />
          )}
          <p className="text-sm text-on-surface-variant">Belum ada task {TAB_LABEL[tab].toLowerCase()} tersedia.</p>
        </div>
      )}

      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-2xl border border-outline-variant bg-surface p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-on-surface">{task.invoice_number}</p>
              {task.distance_km !== undefined && (
                <p className="text-xs text-on-surface-variant">{task.distance_km} km dari outlet</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleClaim(task.id)}
              disabled={claimMutation.isPending || hasActiveTask}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-on-primary hover:bg-primary/90 transition-colors disabled:opacity-50"
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
