import { useState } from "react";
import { Link } from "react-router-dom";
import { usePaginationParams } from "../../hooks/usePaginationParams";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useEmployeesQuery } from "../../hooks/employees/useEmployeesQuery";
import { useSoftDeleteEmployeeMutation } from "../../hooks/employees/useSoftDeleteEmployeeMutation";
import { useHardDeleteEmployeeMutation } from "../../hooks/employees/useHardDeleteEmployeeMutation";
import { useResendInviteMutation } from "../../hooks/employees/useResendInviteMutation";
import { useStaffAuth } from "../../context/StaffAuthContext";
import type { Employee, EmployeeRole } from "../../types/employee";
import { BackLink } from "../../components/ui/BackLink";
import { Card } from "../../components/ui/Card";
import { inputClasses } from "../../components/ui/Input";
import { Pagination } from "../../components/ui/Pagination";

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

const STATUS_BADGE: Record<string, string> = {
  active: "bg-primary/10 text-primary",
  inactive: "bg-surface-container text-on-surface-variant",
  deleted: "bg-error/10 text-error",
};

interface EmployeeRowProps {
  employee: Employee;
  isSelf: boolean;
}

function EmployeeRow({ employee, isSelf }: EmployeeRowProps) {
  const softDelete = useSoftDeleteEmployeeMutation();
  const hardDelete = useHardDeleteEmployeeMutation();
  const resendInvite = useResendInviteMutation();
  const isDeleted = !!employee.deleted_at;

  const handleResendInvite = () => {
    if (window.confirm(`Kirim ulang undangan ke "${employee.full_name}"?`)) {
      resendInvite.mutate(employee.id);
    }
  };

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
    <tr className="border-b border-outline-variant last:border-0">
      <td className="py-3 px-4 text-sm text-on-surface font-medium">{employee.full_name}</td>
      <td className="py-3 px-4 text-sm text-on-surface">{employee.email}</td>
      <td className="py-3 px-4 text-sm text-on-surface">{ROLE_LABELS[employee.role]}</td>
      <td className="py-3 px-4 text-sm text-on-surface">
        {employee.outlet_deleted ? (
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE.deleted}`}>Outlet dihapus</span>
        ) : (
          employee.outlet_name ?? "—"
        )}
      </td>
      <td className="py-3 px-4 text-sm">
        {isDeleted ? (
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE.deleted}`}>Dihapus</span>
        ) : (
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${employee.is_active ? STATUS_BADGE.active : STATUS_BADGE.inactive}`}>
            {employee.is_active ? "Aktif" : "Nonaktif"}
          </span>
        )}
      </td>
      <td className="py-3 px-4">
        <div className="flex gap-2 flex-wrap">
          <Link to={`/staff/admin/employees/${employee.id}/edit`} className="text-xs font-semibold text-primary hover:underline">UBAH</Link>
          {!employee.is_active && !isDeleted && (
            <button
              type="button"
              className="text-xs font-semibold text-primary hover:underline disabled:opacity-50"
              onClick={handleResendInvite}
              disabled={resendInvite.isPending}
            >
              KIRIM ULANG
            </button>
          )}
          {!isDeleted ? (
            <button
              type="button"
              className="text-xs font-semibold text-error hover:underline disabled:opacity-50"
              onClick={handleSoftDelete}
              disabled={isSelf || softDelete.isPending}
            >
              NONAKTIFKAN
            </button>
          ) : (
            <button
              type="button"
              className="text-xs font-semibold text-error hover:underline disabled:opacity-50"
              onClick={handleHardDelete}
              disabled={isSelf || hardDelete.isPending}
            >
              HAPUS
            </button>
          )}
        </div>
      </td>
    </tr>
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
  const employees = employeesQuery.data?.data ?? [];
  const totalCount = employeesQuery.data?.total_count ?? 0;

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <BackLink to="/staff/dashboard">Kembali ke dashboard</BackLink>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-on-surface">Karyawan</h1>
        <Link to="/staff/admin/employees/new" className="text-sm font-semibold text-primary hover:underline">TAMBAH KARYAWAN</Link>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              className={inputClasses}
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
              className={inputClasses}
              type="text"
              placeholder="Cari nama atau email..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setPage(1);
              }}
            />

            <div className="flex items-center gap-2">
              <input
                id="include_deleted"
                type="checkbox"
                checked={includeDeleted}
                onChange={(e) => {
                  setIncludeDeleted(e.target.checked);
                  setPage(1);
                }}
              />
              <label htmlFor="include_deleted" className="text-sm text-on-surface">Tampilkan yang dihapus</label>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                <th className="py-2.5 px-4 text-left text-xs font-semibold text-on-surface-variant uppercase">Nama</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold text-on-surface-variant uppercase">Email</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold text-on-surface-variant uppercase">Peran</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold text-on-surface-variant uppercase">Outlet</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold text-on-surface-variant uppercase">Status</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold text-on-surface-variant uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {employeesQuery.isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-on-surface-variant">Memuat...</td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-on-surface-variant">Belum ada karyawan.</td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <EmployeeRow
                    key={employee.id}
                    employee={employee}
                    isSelf={employee.id === currentEmployee?.id}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Pagination page={page} limit={limit} totalCount={totalCount} onPageChange={setPage} />
    </main>
  );
}
