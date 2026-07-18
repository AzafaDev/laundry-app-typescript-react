import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { usePaginationParams } from "../../hooks/usePaginationParams";
import { useLaundryItemsQuery } from "../../hooks/laundryItems/useLaundryItemsQuery";
import { useDeleteLaundryItemMutation } from "../../hooks/laundryItems/useDeleteLaundryItemMutation";
import type { LaundryItem } from "../../types/laundryItem";
import { buttonClasses } from "../../components/ui/buttonStyles";
import { Card } from "../../components/ui/Card";
import { Pagination } from "../../components/ui/Pagination";
import { LoadingState, EmptyState } from "../../components/ui/PageState";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { BackLink } from "../../components/ui/BackLink";
import { formatRupiah } from "../../utils/formatPrice";

function LaundryItemRow({ item }: { item: LaundryItem }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteMutation = useDeleteLaundryItemMutation();

  const handleDelete = () => {
    deleteMutation.mutate(item.id, {
      onSuccess: () => toast.success("Item berhasil dihapus"),
    });
    setConfirmOpen(false);
  };

  return (
    <tr className="border-b border-outline-variant last:border-0">
      <td className="py-3 px-2 text-sm text-on-surface">{item.name}</td>
      <td className="py-3 px-2 text-sm text-on-surface-variant uppercase">{item.unit}</td>
      <td className="py-3 px-2 text-sm text-on-surface">{formatRupiah(item.base_price)}</td>
      <td className="py-3 px-2">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.is_active ? "bg-primary/10 text-primary" : "bg-surface-container text-on-surface-variant"}`}>
          {item.is_active ? "Aktif" : "Nonaktif"}
        </span>
      </td>
      <td className="py-3 px-2 text-right space-x-3 whitespace-nowrap">
        <Link to={`/staff/admin/laundry-items/${item.id}/edit`} className="text-sm font-semibold text-primary hover:underline">
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
        title="Hapus item laundry?"
        description={`Item "${item.name}" akan dihapus dan tidak muncul lagi di daftar.`}
        confirmLabel="Hapus"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </tr>
  );
}

export function LaundryItems() {
  const { page, limit, offset, setPage } = usePaginationParams();
  const itemsQuery = useLaundryItemsQuery(limit, offset);

  const items = itemsQuery.data?.data ?? [];
  const totalCount = itemsQuery.data?.total_count ?? 0;

  return (
    <main className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <BackLink to="/staff/dashboard">Kembali ke dashboard</BackLink>

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-on-surface">Item Laundry</h1>
        <Link to="/staff/admin/laundry-items/new" className={buttonClasses("primary", "sm")}>
          <Plus className="w-4 h-4" />
          Tambah Item
        </Link>
      </div>

      <Card className="p-0 overflow-hidden">
        {itemsQuery.isLoading ? (
          <div className="p-6">
            <LoadingState label="Memuat item..." bordered={false} />
          </div>
        ) : items.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={Plus} title="Belum ada item" description="Tambahkan item laundry pertama kamu." />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                <th className="py-2.5 px-2 text-left text-xs font-semibold text-on-surface-variant uppercase">Nama</th>
                <th className="py-2.5 px-2 text-left text-xs font-semibold text-on-surface-variant uppercase">Satuan</th>
                <th className="py-2.5 px-2 text-left text-xs font-semibold text-on-surface-variant uppercase">Harga</th>
                <th className="py-2.5 px-2 text-left text-xs font-semibold text-on-surface-variant uppercase">Status</th>
                <th className="py-2.5 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <LaundryItemRow key={item.id} item={item} />
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Pagination page={page} limit={limit} totalCount={totalCount} onPageChange={setPage} />
    </main>
  );
}
