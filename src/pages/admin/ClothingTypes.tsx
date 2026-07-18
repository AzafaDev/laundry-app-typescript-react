import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Shirt } from "lucide-react";
import toast from "react-hot-toast";
import { usePaginationParams } from "../../hooks/usePaginationParams";
import { useClothingTypesQuery } from "../../hooks/clothingTypes/useClothingTypesQuery";
import { useDeleteClothingTypeMutation } from "../../hooks/clothingTypes/useDeleteClothingTypeMutation";
import type { ClothingType } from "../../types/clothingType";
import { buttonClasses } from "../../components/ui/buttonStyles";
import { Card } from "../../components/ui/Card";
import { Pagination } from "../../components/ui/Pagination";
import { LoadingState, EmptyState } from "../../components/ui/PageState";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { BackLink } from "../../components/ui/BackLink";

function ClothingTypeRow({ clothingType }: { clothingType: ClothingType }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteMutation = useDeleteClothingTypeMutation();

  const handleDelete = () => {
    deleteMutation.mutate(clothingType.id, {
      onSuccess: () => toast.success("Jenis pakaian berhasil dihapus"),
    });
    setConfirmOpen(false);
  };

  return (
    <tr className="border-b border-outline-variant last:border-0">
      <td className="py-3 px-2 text-sm text-on-surface">{clothingType.name}</td>
      <td className="py-3 px-2">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${clothingType.is_active ? "bg-primary/10 text-primary" : "bg-surface-container text-on-surface-variant"}`}>
          {clothingType.is_active ? "Aktif" : "Nonaktif"}
        </span>
      </td>
      <td className="py-3 px-2 text-right space-x-3 whitespace-nowrap">
        <Link to={`/staff/admin/clothing-types/${clothingType.id}/edit`} className="text-sm font-semibold text-primary hover:underline">
          Ubah
        </Link>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={deleteMutation.isPending}
          className="text-sm font-semibold text-error hover:underline disabled:opacity-50"
        >
          Hapus
        </button>
      </td>
      <ConfirmDialog
        open={confirmOpen}
        title="Hapus jenis pakaian?"
        description={`"${clothingType.name}" akan dihapus dan tidak muncul lagi di daftar.`}
        confirmLabel="Hapus"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </tr>
  );
}

export function ClothingTypes() {
  const { page, limit, offset, setPage } = usePaginationParams();
  const typesQuery = useClothingTypesQuery(limit, offset);

  const types = typesQuery.data?.data ?? [];
  const totalCount = typesQuery.data?.total_count ?? 0;

  return (
    <main className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <BackLink to="/staff/dashboard">Kembali ke dashboard</BackLink>

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-on-surface">Jenis Pakaian</h1>
        <Link to="/staff/admin/clothing-types/new" className={buttonClasses("primary", "sm")}>
          <Plus className="w-4 h-4" />
          Tambah Jenis
        </Link>
      </div>

      <Card className="p-0 overflow-hidden">
        {typesQuery.isLoading ? (
          <div className="p-6">
            <LoadingState label="Memuat jenis pakaian..." bordered={false} />
          </div>
        ) : types.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={Shirt} title="Belum ada jenis pakaian" description="Tambahkan jenis pakaian pertama kamu." />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                <th className="py-2.5 px-2 text-left text-xs font-semibold text-on-surface-variant uppercase">Nama</th>
                <th className="py-2.5 px-2 text-left text-xs font-semibold text-on-surface-variant uppercase">Status</th>
                <th className="py-2.5 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {types.map((ct) => (
                <ClothingTypeRow key={ct.id} clothingType={ct} />
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Pagination page={page} limit={limit} totalCount={totalCount} onPageChange={setPage} />
    </main>
  );
}
