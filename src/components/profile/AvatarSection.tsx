import { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUploadAvatarMutation } from "../../hooks/profile/useUploadAvatarMutation";
import { FormField } from "../FormField";
import { ApiErrorMessage } from "../ApiErrorMessage";
import { Button } from "../ui/Button";

const sectionHeaderClasses = "flex items-center justify-between mb-2";
const toggleClasses = "text-xs font-bold uppercase tracking-[0.06em] text-primary hover:underline";

export function AvatarSection() {
  const { customer } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useUploadAvatarMutation();

  const startEditing = () => {
    mutation.reset();
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setFile(null);
    setPreviewUrl(null);
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    mutation.mutate(file, {
      onSuccess: () => {
        setFile(null);
        setPreviewUrl(null);
        setIsEditing(false);
      },
    });
  };

  const displayUrl = previewUrl ?? customer?.avatar_url;

  if (!isEditing) {
    return (
      <div>
        <div className={sectionHeaderClasses}>
          <h2 className="text-base font-bold text-on-surface">Avatar</h2>
          <button type="button" className={toggleClasses} onClick={startEditing}>EDIT</button>
        </div>
        {displayUrl ? (
          <img src={displayUrl} alt="Foto profil" className="h-24 w-24 rounded-full object-cover" />
        ) : (
          <p className="text-sm text-on-surface-variant">Belum ada foto profil.</p>
        )}
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className={sectionHeaderClasses}>
        <h2 className="text-base font-bold text-on-surface">Avatar</h2>
        <button type="button" className={toggleClasses} onClick={cancelEditing}>BATAL</button>
      </div>
      <p className="text-sm text-on-surface-variant">Unggah foto buat profil kamu.</p>

      {displayUrl && (
        <img src={displayUrl} alt="Pratinjau foto profil" className="h-24 w-24 rounded-full object-cover" />
      )}

      <FormField label="File gambar" htmlFor="avatar">
        <div className="flex items-center gap-3">
          <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
            Pilih file
          </Button>
          <span className="text-sm text-on-surface-variant">
            {file?.name ?? "Belum ada file dipilih"}
          </span>
        </div>
        <input
          id="avatar"
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </FormField>

      <ApiErrorMessage error={mutation.error} />

      <Button type="submit" fullWidth isLoading={mutation.isPending} disabled={!file}>
        {mutation.isPending ? "Mengunggah..." : "Unggah foto profil"}
      </Button>
    </form>
  );
}
