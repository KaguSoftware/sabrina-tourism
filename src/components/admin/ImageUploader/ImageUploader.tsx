"use client";

import { useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { createBrowserClient } from "@/lib/supabase/browser";
import { getPublicUrl } from "@/lib/supabase/storage";

const BUCKET = "media";
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

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
    setUploadError(null);
    setUploading(true);
    try {
      const blob = await resizeAndConvert(file);
      const slug = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "");
      const path = `${folder}/${Date.now()}-${slug.replace(/\.[^.]+$/, "")}.jpg`;
      const supabase = createBrowserClient();
      const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
        upsert: false,
        contentType: "image/jpeg",
      });
      if (error) throw new Error(error.message);
      onChange(path);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setUploadError(msg);
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  }, [folder, onChange]);

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
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 w-6 h-6 bg-ink/70 text-cream flex items-center justify-center text-sm hover:bg-terracotta transition-colors"
            aria-label="Remove image"
          >
            ×
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 font-mono text-[10px] tracking-[0.2em] uppercase bg-cream/90 text-ink px-2.5 py-1.5 hover:bg-cream transition-colors"
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
            <div className="w-6 h-6 border-2 border-ochre border-t-transparent rounded-full animate-spin" />
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
