import { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUploadAvatarMutation } from "../../hooks/profile/useUploadAvatarMutation";
import { FormField } from "../FormField";
import { ApiErrorMessage } from "../ApiErrorMessage";

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
        <div className="profile-section-header">
          <h2>Avatar</h2>
          <button type="button" className="auth-toggle" onClick={startEditing}>EDIT</button>
        </div>
        {displayUrl ? (
          <img
            src={displayUrl}
            alt="Foto profil"
            style={{ width: 96, height: 96, objectFit: "cover" }}
          />
        ) : (
          <p className="profile-summary">Belum ada foto profil.</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="profile-section-header">
        <h2>Avatar</h2>
        <button type="button" className="auth-toggle" onClick={cancelEditing}>BATAL</button>
      </div>
      <p>Unggah foto buat profil kamu.</p>

      {displayUrl && (
        <img
          src={displayUrl}
          alt="Pratinjau foto profil"
          style={{ width: 96, height: 96, objectFit: "cover", marginBottom: 12 }}
        />
      )}

      <FormField label="File gambar" htmlFor="avatar">
        <div className="auth-input-wrap">
          <button
            type="button"
            className="auth-button auth-button-secondary"
            style={{ marginTop: 0 }}
            onClick={() => fileInputRef.current?.click()}
          >
            Pilih file
          </button>
          <span className="profile-summary" style={{ margin: 0 }}>
            {file?.name ?? "Belum ada file dipilih"}
          </span>
        </div>
        <input
          id="avatar"
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </FormField>

      <ApiErrorMessage error={mutation.error} />

      <button className="auth-button" type="submit" disabled={!file || mutation.isPending}>
        {mutation.isPending ? "Mengunggah..." : "Unggah foto profil"}
      </button>
    </form>
  );
}
