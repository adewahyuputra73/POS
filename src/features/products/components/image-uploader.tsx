"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Upload, X, Image as ImageIcon, GripVertical } from "lucide-react";

interface ImageFile {
  id: string;
  file?: File;
  url: string;
  isPrimary: boolean;
}

interface ImageUploaderProps {
  images: ImageFile[];
  onChange: (images: ImageFile[]) => void;
  maxImages?: number;
  className?: string;
}

export function ImageUploader({
  images,
  onChange,
  maxImages = 5,
  className,
}: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) return;

    const newImages: ImageFile[] = [];
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const id = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        newImages.push({
          id,
          file,
          url: URL.createObjectURL(file),
          isPrimary: images.length === 0 && newImages.length === 0,
        });
      }
    });

    if (newImages.length > 0) {
      onChange([...images, ...newImages]);
    }
  }, [images, maxImages, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeImage = useCallback((id: string) => {
    const filtered = images.filter((img) => img.id !== id);
    // If removed image was primary, make first image primary
    if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
      filtered[0].isPrimary = true;
    }
    onChange(filtered);
  }, [images, onChange]);

  const setPrimary = useCallback((id: string) => {
    const updated = images.map((img) => ({
      ...img,
      isPrimary: img.id === id,
    }));
    onChange(updated);
  }, [images, onChange]);

  const canAddMore = images.length < maxImages;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((image) => (
            <div
              key={image.id}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden border-2 group",
                image.isPrimary ? "border-primary" : "border-border"
              )}
            >
              <img
                src={image.url}
                alt="Product"
                className="w-full h-full object-cover"
              />
              
              {/* Primary Badge */}
              {image.isPrimary && (
                <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-primary text-white text-[10px] font-medium rounded">
                  Utama
                </div>
              )}

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!image.isPrimary && (
                  <button
                    type="button"
                    onClick={() => setPrimary(image.id)}
                    className="p-1.5 bg-surface rounded-lg text-text-primary hover:bg-primary hover:text-white transition-colors"
                    title="Jadikan foto utama"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="p-1.5 bg-surface rounded-lg text-error hover:bg-error hover:text-white transition-colors"
                  title="Hapus foto"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors",
            isDragOver
              ? "border-primary bg-primary-light"
              : "border-border hover:border-primary hover:bg-primary-light/50"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
          <Upload className="h-8 w-8 mx-auto text-text-secondary mb-2" />
          <p className="text-sm font-medium text-text-primary">
            Klik atau seret foto ke sini
          </p>
          <p className="text-xs text-text-secondary mt-1">
            Maksimal {maxImages} foto, format JPG/PNG
          </p>
          <p className="text-xs text-text-secondary">
            {images.length}/{maxImages} foto
          </p>
        </div>
      )}
    </div>
  );
}
