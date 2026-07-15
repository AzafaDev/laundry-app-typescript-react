import { Link } from "react-router-dom";
import { usePaginationParams } from "../../hooks/usePaginationParams";
import { useOutletsQuery } from "../../hooks/outlets/useOutletsQuery";
import { useDeleteOutletMutation } from "../../hooks/outlets/useDeleteOutletMutation";
import type { Outlet } from "../../types/outlet";
import "../../styles/auth.css";
import "../../styles/admin.css";

function OutletRow({ outlet }: { outlet: Outlet }) {
  const deleteMutation = useDeleteOutletMutation();

  const handleDelete = () => {
    if (window.confirm(`Yakin hapus outlet "${outlet.name}"?`)) {
      deleteMutation.mutate(outlet.id);
    }
  };

  return (
    <div className="admin-table-row">
      <span className="admin-table-cell">{outlet.name}</span>
      <span className="admin-table-cell">{outlet.address}</span>
      <span className="admin-table-cell" style={{ flex: "0 0 90px" }}>
        <span className={`admin-status-badge ${outlet.is_active ? "admin-status-badge-active" : ""}`}>
          {outlet.is_active ? "Aktif" : "Nonaktif"}
        </span>
      </span>
      <span className="admin-table-cell-actions" style={{ flex: "0 0 90px" }}>
        <Link to={`/staff/admin/outlets/${outlet.id}/edit`} className="auth-toggle">UBAH</Link>
        <button
          type="button"
          className="auth-toggle auth-toggle-danger"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          HAPUS
        </button>
      </span>
    </div>
  );
}

export function Outlets() {
  const { limit, offset, page, setPage } = usePaginationParams();
  const outletsQuery = useOutletsQuery(limit, offset);

  const outlets = outletsQuery.data?.data ?? [];
  const totalCount = outletsQuery.data?.total_count ?? 0;
  const rangeStart = totalCount === 0 ? 0 : offset + 1;
  const rangeEnd = Math.min(offset + limit, totalCount);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Outlet</h1>
        <Link to="/staff/admin/outlets/new" className="auth-toggle">TAMBAH OUTLET</Link>
      </div>

      <div className="admin-table">
        <div className="admin-table-header">
          <span className="admin-table-cell">Nama</span>
          <span className="admin-table-cell">Alamat</span>
          <span className="admin-table-cell" style={{ flex: "0 0 90px" }}>Status</span>
          <span className="admin-table-cell-actions" style={{ flex: "0 0 90px" }}>Aksi</span>
        </div>

        {outletsQuery.isLoading ? (
          <div className="admin-table-empty">Memuat...</div>
        ) : outlets.length === 0 ? (
          <div className="admin-table-empty">Belum ada outlet.</div>
        ) : (
          outlets.map((outlet) => <OutletRow key={outlet.id} outlet={outlet} />)
        )}
      </div>

      <div className="admin-pagination">
        <span className="admin-pagination-info">
          {totalCount === 0 ? "Tidak ada outlet" : `Menampilkan ${rangeStart}–${rangeEnd} dari ${totalCount}`}
        </span>
        <div className="admin-pagination-controls">
          <button
            type="button"
            className="auth-toggle"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
          >
            SEBELUMNYA
          </button>
          <button
            type="button"
            className="auth-toggle"
            onClick={() => setPage(page + 1)}
            disabled={rangeEnd >= totalCount}
          >
            SELANJUTNYA
          </button>
        </div>
      </div>
    </div>
  );
}
