"use client";

import { useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { createBrowserClient } from "@/lib/supabase/browser";
import { getPublicUrl } from "@/lib/supabase/storage";
import { Spinner } from "@/components/admin/Spinner/Spinner";

const BUCKET = "media";
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

// Keyed by name-size-lastModified so repeat uploads of the same file skip canvas resize
const blobCache = new Map<string, Blob>();
function blobKey(file: File) { return `${file.name}-${file.size}-${file.lastModified}`; }

function isStoragePath(p: string | null): p is string {
  return !!p && !p.startsWith("http://") && !p.startsWith("https://") && !p.startsWith("/");
}

async function deleteStored(path: string | null) {
  if (!isStoragePath(path)) return;
  try {
    const supabase = createBrowserClient();
    await supabase.storage.from(BUCKET).remove([path]);
  } catch {
    // Non-fatal: leave orphan rather than block the UI.
  }
}

interface ImageUploaderProps {
  value: string | null;
  onChange: (path: string | null) => void;
  folder: string;
  aspectRatio?: string;
}

async function resizeAndConvert(file: File, maxPx = 2400): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxPx) {
        height = Math.round((height * maxPx) / width);
        width = maxPx;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context unavailable"));
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Canvas toBlob failed"));
          resolve(blob);
        },
        "image/jpeg",
        0.85,
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image load failed")); };
    img.src = url;
  });
}

export function ImageUploader({ value, onChange, folder, aspectRatio = "16/9" }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!ACCEPTED.includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP images are accepted.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error("Image too large — please upload under 20 MB.");
      return;
    }
    const previous = value;
    setUploadError(null);
    setUploading(true);
    try {
      const key = blobKey(file);
      const blob = blobCache.get(key) ?? await resizeAndConvert(file);
      if (!blobCache.has(key)) blobCache.set(key, blob);
      const slug = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "");
      const path = `${folder}/${Date.now()}-${slug.replace(/\.[^.]+$/, "")}.jpg`;
      const supabase = createBrowserClient();
      const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
        upsert: false,
        contentType: "image/jpeg",
      });
      if (error) throw new Error(error.message);
      onChange(path);
      void deleteStored(previous);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setUploadError(msg);
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  }, [folder, onChange, value]);

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  const previewUrl = value ? getPublicUrl(value) : null;

  return (
    <div className="space-y-2">
      {previewUrl ? (
        <div className="relative border border-rule bg-cream-warm" style={{ aspectRatio }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => { const prev = value; onChange(null); void deleteStored(prev); }}
            className="absolute top-2 right-2 w-7 h-7 bg-ink/70 text-cream flex items-center justify-center text-sm border border-cream/30 hover:bg-terracotta hover:border-cream transition-colors rounded-sm"
            aria-label="Remove image"
            title="Remove image"
          >
            ×
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 inline-flex items-center font-mono text-[10px] tracking-[0.2em] uppercase font-medium bg-cream text-ink border border-rule hover:border-ochre hover:bg-cream-deep px-3 py-2 transition-colors rounded-sm shadow-sm"
            title="Replace image"
          >
            Replace
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed bg-cream-warm flex flex-col items-center justify-center cursor-pointer transition-all duration-200 select-none ${
            dragOver
              ? "border-ochre scale-[1.01]"
              : "border-ochre/40 hover:border-ochre"
          }`}
          style={{ aspectRatio, minHeight: "120px" }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          role="button"
          aria-label="Upload image"
        >
          {uploading ? (
            <Spinner size="sm" />
          ) : (
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted text-center px-4">
              Drop image or click to upload
            </span>
          )}
        </div>
      )}

      {uploadError && (
        <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-terracotta">{uploadError}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="sr-only"
        onChange={onInputChange}
        aria-hidden="true"
      />
    </div>
  );
}
