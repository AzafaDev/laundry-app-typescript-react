import { useState } from "react";
import { Link } from "react-router-dom";
import { usePaginationParams } from "../../hooks/usePaginationParams";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useEmployeesQuery } from "../../hooks/employees/useEmployeesQuery";
import { useSoftDeleteEmployeeMutation } from "../../hooks/employees/useSoftDeleteEmployeeMutation";
import { useHardDeleteEmployeeMutation } from "../../hooks/employees/useHardDeleteEmployeeMutation";
import { useOutletsQuery } from "../../hooks/outlets/useOutletsQuery";
import { useStaffAuth } from "../../context/StaffAuthContext";
import type { Employee, EmployeeRole } from "../../types/employee";
import "../../styles/auth.css";
import "../../styles/admin.css";

const ROLES: EmployeeRole[] = [
  "super_admin",
  "outlet_admin",
  "washing_worker",
  "ironing_worker",
  "packing_worker",
  "driver",
];

const ROLE_LABELS: Record<EmployeeRole, string> = {
  super_admin: "Super Admin",
  outlet_admin: "Admin Outlet",
  washing_worker: "Pekerja Cuci",
  ironing_worker: "Pekerja Setrika",
  packing_worker: "Pekerja Kemas",
  driver: "Kurir",
};

interface EmployeeRowProps {
  employee: Employee;
  outletName: string | null;
  isSelf: boolean;
}

function EmployeeRow({ employee, outletName, isSelf }: EmployeeRowProps) {
  const softDelete = useSoftDeleteEmployeeMutation();
  const hardDelete = useHardDeleteEmployeeMutation();
  const isDeleted = !!employee.deleted_at;

  const handleSoftDelete = () => {
    if (window.confirm(`Nonaktifkan "${employee.full_name}"?`)) {
      softDelete.mutate(employee.id);
    }
  };

  const handleHardDelete = () => {
    if (window.confirm(`Hapus permanen "${employee.full_name}"? Tindakan ini tidak bisa dibatalkan.`)) {
      hardDelete.mutate(employee.id);
    }
  };

  return (
    <div className="admin-table-row">
      <span className="admin-table-cell">{employee.full_name}</span>
      <span className="admin-table-cell">{employee.email}</span>
      <span className="admin-table-cell" style={{ flex: "0 0 140px" }}>{ROLE_LABELS[employee.role]}</span>
      <span className="admin-table-cell" style={{ flex: "0 0 140px" }}>{outletName ?? "—"}</span>
      <span className="admin-table-cell" style={{ flex: "0 0 110px" }}>
        {isDeleted ? (
          <span className="admin-status-badge">Dihapus</span>
        ) : (
          <span className={`admin-status-badge ${employee.is_active ? "admin-status-badge-active" : ""}`}>
            {employee.is_active ? "Aktif" : "Nonaktif"}
          </span>
        )}
      </span>
      <span className="admin-table-cell-actions" style={{ flex: "0 0 170px" }}>
        <Link to={`/staff/admin/employees/${employee.id}/edit`} className="auth-toggle">UBAH</Link>
        {!isDeleted ? (
          <button
            type="button"
            className="auth-toggle auth-toggle-danger"
            onClick={handleSoftDelete}
            disabled={isSelf || softDelete.isPending}
          >
            NONAKTIFKAN
          </button>
        ) : (
          <button
            type="button"
            className="auth-toggle auth-toggle-danger"
            onClick={handleHardDelete}
            disabled={isSelf || hardDelete.isPending}
          >
            HAPUS PERMANEN
          </button>
        )}
      </span>
    </div>
  );
}

export function Employees() {
  const [role, setRole] = useState<EmployeeRole | "">("");
  const [searchInput, setSearchInput] = useState("");
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const search = useDebouncedValue(searchInput, 400);
  const { limit, offset, page, setPage } = usePaginationParams();
  const { employee: currentEmployee } = useStaffAuth();

  const employeesQuery = useEmployeesQuery({
    role: role || undefined,
    search: search || undefined,
    include_deleted: includeDeleted,
    limit,
    offset,
  });
  const outletsQuery = useOutletsQuery(500, 0);

  const employees = employeesQuery.data?.data ?? [];
  const totalCount = employeesQuery.data?.total_count ?? 0;
  const rangeStart = totalCount === 0 ? 0 : offset + 1;
  const rangeEnd = Math.min(offset + limit, totalCount);
  const outletNameById = new Map((outletsQuery.data?.data ?? []).map((o) => [o.id, o.name]));

  return (
    <div className="admin-page admin-page-wide">
      <div className="admin-page-header">
        <h1>Karyawan</h1>
        <Link to="/staff/admin/employees/new" className="auth-toggle">TAMBAH KARYAWAN</Link>
      </div>

      <div className="admin-filter-row">
        <select
          className="auth-input"
          value={role}
          onChange={(e) => {
            setRole(e.target.value as EmployeeRole | "");
            setPage(1);
          }}
        >
          <option value="">Semua peran</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>

        <input
          className="auth-input"
          type="text"
          placeholder="Cari nama atau email..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setPage(1);
          }}
        />

        <div className="auth-checkbox-row">
          <input
            id="include_deleted"
            type="checkbox"
            checked={includeDeleted}
            onChange={(e) => {
              setIncludeDeleted(e.target.checked);
              setPage(1);
            }}
          />
          <label htmlFor="include_deleted">Tampilkan yang dihapus</label>
        </div>
      </div>

      <div className="admin-table">
        <div className="admin-table-header">
          <span className="admin-table-cell">Nama</span>
          <span className="admin-table-cell">Email</span>
          <span className="admin-table-cell" style={{ flex: "0 0 140px" }}>Peran</span>
          <span className="admin-table-cell" style={{ flex: "0 0 140px" }}>Outlet</span>
          <span className="admin-table-cell" style={{ flex: "0 0 110px" }}>Status</span>
          <span className="admin-table-cell-actions" style={{ flex: "0 0 170px" }}>Aksi</span>
        </div>

        {employeesQuery.isLoading ? (
          <div className="admin-table-empty">Memuat...</div>
        ) : employees.length === 0 ? (
          <div className="admin-table-empty">Belum ada karyawan.</div>
        ) : (
          employees.map((employee) => (
            <EmployeeRow
              key={employee.id}
              employee={employee}
              outletName={employee.outlet_id ? outletNameById.get(employee.outlet_id) ?? null : null}
              isSelf={employee.id === currentEmployee?.id}
            />
          ))
        )}
      </div>

      <div className="admin-pagination">
        <span className="admin-pagination-info">
          {totalCount === 0 ? "Tidak ada karyawan" : `Menampilkan ${rangeStart}–${rangeEnd} dari ${totalCount}`}
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
