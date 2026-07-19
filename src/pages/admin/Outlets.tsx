import { Link } from "react-router-dom";
import { usePaginationParams } from "../../hooks/usePaginationParams";
import { useOutletsQuery } from "../../hooks/outlets/useOutletsQuery";
import { useDeleteOutletMutation } from "../../hooks/outlets/useDeleteOutletMutation";
import type { Outlet } from "../../types/outlet";
import { BackLink } from "../../components/ui/BackLink";
import { Card } from "../../components/ui/Card";
import { Pagination } from "../../components/ui/Pagination";

const STATUS_BADGE: Record<string, string> = {
  active: "bg-primary/10 text-primary",
  inactive: "bg-surface-container text-on-surface-variant",
};

function OutletRow({ outlet }: { outlet: Outlet }) {
  const deleteMutation = useDeleteOutletMutation();

  const handleDelete = () => {
    if (window.confirm(`Yakin hapus outlet "${outlet.name}"?`)) {
      deleteMutation.mutate(outlet.id);
    }
  };

  return (
    <tr className="border-b border-outline-variant last:border-0">
      <td className="py-3 px-4 text-sm text-on-surface font-medium">{outlet.name}</td>
      <td className="py-3 px-4 text-sm text-on-surface">{outlet.address}</td>
      <td className="py-3 px-4 text-sm text-on-surface">{outlet.service_radius_km} km</td>
      <td className="py-3 px-4 text-sm">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${outlet.is_active ? STATUS_BADGE.active : STATUS_BADGE.inactive}`}>
          {outlet.is_active ? "Aktif" : "Nonaktif"}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex gap-2">
          <Link to={`/staff/admin/outlets/${outlet.id}/edit`} className="text-xs font-semibold text-primary hover:underline">UBAH</Link>
          <button
            type="button"
            className="text-xs font-semibold text-error hover:underline disabled:opacity-50"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            HAPUS
          </button>
        </div>
      </td>
    </tr>
  );
}

export function Outlets() {
  const { limit, offset, page, setPage } = usePaginationParams();
  const outletsQuery = useOutletsQuery(limit, offset);

  const outlets = outletsQuery.data?.data ?? [];
  const totalCount = outletsQuery.data?.total_count ?? 0;

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <BackLink to="/staff/dashboard">Kembali ke dashboard</BackLink>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-on-surface">Outlet</h1>
        <Link to="/staff/admin/outlets/new" className="text-sm font-semibold text-primary hover:underline">TAMBAH OUTLET</Link>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                <th className="py-2.5 px-4 text-left text-xs font-semibold text-on-surface-variant uppercase">Nama</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold text-on-surface-variant uppercase">Alamat</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold text-on-surface-variant uppercase">Radius</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold text-on-surface-variant uppercase">Status</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold text-on-surface-variant uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {outletsQuery.isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-on-surface-variant">Memuat...</td>
                </tr>
              ) : outlets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-on-surface-variant">Belum ada outlet.</td>
                </tr>
              ) : (
                outlets.map((outlet) => <OutletRow key={outlet.id} outlet={outlet} />)
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Pagination page={page} limit={limit} totalCount={totalCount} onPageChange={setPage} />
    </main>
  );
}
