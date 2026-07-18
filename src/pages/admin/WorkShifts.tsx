import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { usePaginationParams } from "../../hooks/usePaginationParams";
import { useWorkShiftsQuery } from "../../hooks/shifts/useWorkShiftsQuery";
import { useDeletedWorkShiftsQuery } from "../../hooks/shifts/useDeletedWorkShiftsQuery";
import { useSoftDeleteWorkShiftMutation } from "../../hooks/shifts/useSoftDeleteWorkShiftMutation";
import { useHardDeleteWorkShiftMutation } from "../../hooks/shifts/useHardDeleteWorkShiftMutation";
import type { WorkShift } from "../../types/shift";
import { buttonClasses } from "../../components/ui/buttonStyles";
import { Card } from "../../components/ui/Card";
import { Pagination } from "../../components/ui/Pagination";
import { LoadingState, EmptyState } from "../../components/ui/PageState";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { BackLink } from "../../components/ui/BackLink";
import { ApiError } from "../../api/client";

function WorkShiftRow({ shift }: { shift: WorkShift }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteMutation = useSoftDeleteWorkShiftMutation();

  const handleDelete = () => {
    deleteMutation.mutate(shift.id, {
      onSuccess: () => toast.success("Shift berhasil dihapus"),
    });
    setConfirmOpen(false);
  };

  const isDeleteDisabled = deleteMutation.isPending;
  const deleteError = deleteMutation.error instanceof ApiError ? deleteMutation.error.message : null;

  return (
    <>
      <tr className="border-b border-outline-variant last:border-0">
        <td className="py-3 px-2 text-sm text-on-surface">{shift.name}</td>
        <td className="py-3 px-2 text-sm text-on-surface">{shift.start_time}</td>
        <td className="py-3 px-2 text-sm text-on-surface">{shift.end_time}</td>
        <td className="py-3 px-2">
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${shift.is_active ? "bg-primary/10 text-primary" : "bg-surface-container text-on-surface-variant"}`}>
            {shift.is_active ? "Aktif" : "Nonaktif"}
          </span>
        </td>
        <td className="py-3 px-2 text-right space-x-3 whitespace-nowrap">
          <Link to={`/staff/admin/shifts/${shift.id}/edit`} className="text-sm font-semibold text-primary hover:underline">
            Ubah
          </Link>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={isDeleteDisabled}
            title={deleteError || ""}
            className="text-sm font-semibold text-error hover:underline disabled:opacity-50"
          >
            Hapus
          </button>
        </td>
      </tr>
      {deleteError && (
        <tr className="bg-error-container/20 border-b border-outline-variant">
          <td colSpan={5} className="py-2 px-2">
            <p className="text-xs text-error">{deleteError}</p>
          </td>
        </tr>
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Hapus shift?"
        description={`Shift "${shift.name}" akan dinonaktifkan dan tidak bisa dijadwalkan untuk karyawan baru.`}
        confirmLabel="Hapus"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

function DeletedWorkShiftRow({ shift }: { shift: WorkShift }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const hardDeleteMutation = useHardDeleteWorkShiftMutation();

  const handlePermanentDelete = () => {
    hardDeleteMutation.mutate(shift.id, {
      onSuccess: () => toast.success("Shift berhasil dihapus permanen"),
    });
    setConfirmOpen(false);
  };

  const isPermanentDeleteDisabled = hardDeleteMutation.isPending;
  const permanentDeleteError = hardDeleteMutation.error instanceof ApiError ? hardDeleteMutation.error.message : null;

  return (
    <>
      <tr className="border-b border-outline-variant last:border-0 opacity-60">
        <td className="py-3 px-2 text-sm text-on-surface line-through">{shift.name}</td>
        <td className="py-3 px-2 text-sm text-on-surface">{shift.start_time}</td>
        <td className="py-3 px-2 text-sm text-on-surface">{shift.end_time}</td>
        <td className="py-3 px-2">
          <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold bg-surface-container text-on-surface-variant">
            Dihapus
          </span>
        </td>
        <td className="py-3 px-2 text-right whitespace-nowrap">
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={isPermanentDeleteDisabled}
            title={permanentDeleteError || ""}
            className="text-sm font-semibold text-error hover:underline disabled:opacity-50"
          >
            Hapus Permanen
          </button>
        </td>
      </tr>
      {permanentDeleteError && (
        <tr className="bg-error-container/20 border-b border-outline-variant">
          <td colSpan={5} className="py-2 px-2">
            <p className="text-xs text-error">{permanentDeleteError}</p>
          </td>
        </tr>
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Hapus permanen?"
        description={`Shift "${shift.name}" akan dihapus selamanya. Tindakan ini tidak bisa dibatalkan.`}
        confirmLabel="Hapus Permanen"
        danger
        onConfirm={handlePermanentDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

export function WorkShifts() {
  const { page, limit, offset, setPage } = usePaginationParams();
  const [showDeleted, setShowDeleted] = useState(false);

  const shiftsQuery = useWorkShiftsQuery(limit, offset);
  const deletedShiftsQuery = useDeletedWorkShiftsQuery(limit, offset);

  const shifts = shiftsQuery.data?.data ?? [];
  const totalCount = shiftsQuery.data?.total_count ?? 0;

  const deletedShifts = deletedShiftsQuery.data?.data ?? [];
  const deletedTotalCount = deletedShiftsQuery.data?.total_count ?? 0;

  const currentShifts = showDeleted ? deletedShifts : shifts;
  const currentTotalCount = showDeleted ? deletedTotalCount : totalCount;
  const currentQuery = showDeleted ? deletedShiftsQuery : shiftsQuery;

  return (
    <main className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <BackLink to="/staff/dashboard">Kembali ke dashboard</BackLink>

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-on-surface">Shift Kerja</h1>
        <Link to="/staff/admin/shifts/new" className={buttonClasses("primary", "sm")}>
          <Plus className="w-4 h-4" />
          Tambah Shift
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setShowDeleted(!showDeleted);
            setPage(1);
          }}
          className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
        >
          {showDeleted ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showDeleted ? "Sembunyikan yang dihapus" : "Tampilkan yang dihapus"}
        </button>
      </div>

      <Card className="p-0 overflow-hidden">
        {currentQuery.isLoading ? (
          <div className="p-6">
            <LoadingState label="Memuat shift..." bordered={false} />
          </div>
        ) : currentShifts.length === 0 ? (
          <div className="p-6">
            {showDeleted ? (
              <EmptyState icon={Plus} title="Belum ada shift yang dihapus" description="Shift yang dihapus akan muncul di sini." />
            ) : (
              <EmptyState icon={Plus} title="Belum ada shift" description="Tambahkan shift kerja pertama kamu." />
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                <th className="py-2.5 px-2 text-left text-xs font-semibold text-on-surface-variant uppercase">Nama</th>
                <th className="py-2.5 px-2 text-left text-xs font-semibold text-on-surface-variant uppercase">Mulai</th>
                <th className="py-2.5 px-2 text-left text-xs font-semibold text-on-surface-variant uppercase">Selesai</th>
                <th className="py-2.5 px-2 text-left text-xs font-semibold text-on-surface-variant uppercase">Status</th>
                <th className="py-2.5 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {showDeleted
                ? deletedShifts.map((shift) => <DeletedWorkShiftRow key={shift.id} shift={shift} />)
                : shifts.map((shift) => <WorkShiftRow key={shift.id} shift={shift} />)}
            </tbody>
          </table>
        )}
      </Card>

      <Pagination page={page} limit={limit} totalCount={currentTotalCount} onPageChange={setPage} />
    </main>
  );
}
