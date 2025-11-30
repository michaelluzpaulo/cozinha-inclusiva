"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string | null) => void;
  onUpload: (file: File) => Promise<string>;
  disabled?: boolean;
  label?: string;
  accept?: string;
}

export default function ImageUpload({
  currentImage,
  onImageChange,
  onUpload,
  disabled = false,
  label = "Imagem",
  accept = "image/jpeg,image/jpg,image/png,image/webp",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar preview com currentImage quando componente monta ou currentImage muda externamente
  useEffect(() => {
    if (!isUploading) {
      setPreview(currentImage || null);
    }
  }, [currentImage, isUploading]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Criar preview local
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    setIsUploading(true);

    try {
      const uploadedImageUrl = await onUpload(file);

      // Limpar preview local
      URL.revokeObjectURL(previewUrl);

      // Atualizar o form e o preview com a URL do servidor
      onImageChange(uploadedImageUrl);
      setPreview(uploadedImageUrl);
    } catch (error) {
      console.error("Erro no upload:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao fazer upload da imagem"
      );

      // Reverter preview em caso de erro
      URL.revokeObjectURL(previewUrl);
      setPreview(currentImage || null);
    } finally {
      setIsUploading(false);
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Preview da imagem */}
      {preview ? (
        <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          {!isUploading && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
              disabled={disabled}
            >
              <X size={16} />
            </button>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-white text-sm">Fazendo upload...</div>
            </div>
          )}
        </div>
      ) : (
        /* Área de upload */
        <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors">
          <ImageIcon className="text-gray-400 mb-2" size={48} />
          <p className="text-gray-500 text-sm mb-2">
            Clique para selecionar uma imagem
          </p>
          <p className="text-gray-400 text-xs">JPG, PNG ou WebP (máx. 5MB)</p>
        </div>
      )}

      {/* Input e botões */}
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />

        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          disabled={disabled || isUploading}
          className="flex items-center gap-2"
        >
          <Upload size={16} />
          {isUploading
            ? "Enviando..."
            : preview
            ? "Alterar Imagem"
            : "Selecionar Imagem"}
        </Button>

        {preview && !isUploading && (
          <Button
            type="button"
            variant="destructive"
            onClick={handleRemoveImage}
            disabled={disabled}
          >
            Remover
          </Button>
        )}
      </div>
    </div>
  );
}
