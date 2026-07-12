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
            alt="Avatar"
            style={{ width: 96, height: 96, objectFit: "cover" }}
          />
        ) : (
          <p className="profile-summary">No avatar uploaded.</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="profile-section-header">
        <h2>Avatar</h2>
        <button type="button" className="auth-toggle" onClick={cancelEditing}>CANCEL</button>
      </div>
      <p>Upload a photo for your profile.</p>

      {displayUrl && (
        <img
          src={displayUrl}
          alt="Avatar preview"
          style={{ width: 96, height: 96, objectFit: "cover", marginBottom: 12 }}
        />
      )}

      <FormField label="Image file" htmlFor="avatar">
        <div className="auth-input-wrap">
          <button
            type="button"
            className="auth-button auth-button-secondary"
            style={{ marginTop: 0 }}
            onClick={() => fileInputRef.current?.click()}
          >
            Choose file
          </button>
          <span className="profile-summary" style={{ margin: 0 }}>
            {file?.name ?? "No file selected"}
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
        {mutation.isPending ? "Uploading..." : "Upload avatar"}
      </button>
    </form>
  );
}
