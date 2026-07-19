import { useState } from "react";
import { Package } from "lucide-react";
import { useStaffAuth } from "../../context/StaffAuthContext";
import { useStationOrdersQuery } from "../../hooks/worker/useStationOrdersQuery";
import { STATION_FOR_ROLE, STATION_LABEL } from "../../components/worker/workerConstants";
import { StationProcessModal } from "../../components/worker/StationProcessModal";
import { ApiErrorMessage } from "../../components/ApiErrorMessage";
import { BackLink } from "../../components/ui/BackLink";
import { Card } from "../../components/ui/Card";
import { LoadingState, EmptyState } from "../../components/ui/PageState";

export function Station() {
  const { employee } = useStaffAuth();
  const station = employee ? STATION_FOR_ROLE[employee.role] : undefined;
  const stationOrdersQuery = useStationOrdersQuery(station);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const orders = stationOrdersQuery.data?.data ?? [];
  const activeOrder = orders.find((o) => o.id === activeOrderId);

  if (!station) {
    return (
      <main className="max-w-2xl mx-auto px-4 md:px-8 py-10">
        <p className="text-sm text-error">Role kamu tidak punya station yang ditugaskan.</p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <BackLink to="/staff/dashboard">Kembali ke dashboard</BackLink>

      <div>
        <h1 className="text-2xl font-bold text-on-surface">{STATION_LABEL[station]}</h1>
        <p className="text-sm text-on-surface-variant mt-1">Antrian pesanan di station kamu.</p>
      </div>

      <ApiErrorMessage error={stationOrdersQuery.error} />

      {stationOrdersQuery.isLoading && (
        <Card>
          <LoadingState label="Memuat antrian..." bordered={false} />
        </Card>
      )}

      {!stationOrdersQuery.isLoading && orders.length === 0 && !stationOrdersQuery.isError && (
        <Card>
          <EmptyState icon={Package} title="Belum ada pesanan" description="Antrian pesanan di station kamu akan muncul di sini." />
        </Card>
      )}

      <div className="space-y-3">
        {orders.map((order) => (
          <button
            key={order.id}
            type="button"
            onClick={() => setActiveOrderId(order.id)}
            className="w-full text-left rounded-2xl border border-outline-variant bg-surface p-4 hover:border-primary/40 transition-colors"
          >
            <p className="text-sm font-bold text-on-surface">{order.invoice_number}</p>
            <p className="text-xs text-on-surface-variant">Pickup: {order.pickup_date}</p>
          </button>
        ))}
      </div>

      {activeOrder && (
        <StationProcessModal
          station={station}
          orderId={activeOrder.id}
          invoiceNumber={activeOrder.invoice_number}
          onClose={() => setActiveOrderId(null)}
        />
      )}
    </main>
  );
}
