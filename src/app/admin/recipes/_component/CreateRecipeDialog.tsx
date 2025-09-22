"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ListRestrictionsAction } from "@/Actions/Restriction/ListRestrictionsAction";
import { UploadImageAction } from "@/Actions/Storage/UploadImageAction";
import { CreateRecipeAction } from "@/Actions/Recipe/CreateRecipeAction";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import type { Restriction } from "@/Contracts/Restriction";
import type { Recipe } from "@/Contracts/Recipe";

interface CreateRecipeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRecipe?: () => void; // Simplificado - apenas callback para recarregar dados
}

const initStateForm = {
  title: "",
  description: "",
  img: "",
  restrictions: [] as number[],
};

export default function CreateRecipeDialog({
  open,
  onOpenChange,
  onAddRecipe,
}: CreateRecipeDialogProps) {
  const [form, setForm] = useState<typeof initStateForm>(initStateForm);
  const [restrictions, setRestrictions] = useState<Restriction[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    async function fetchRestrictions() {
      setLoading(true);
      try {
        const data = await ListRestrictionsAction.execute();
        setRestrictions(data);
      } catch (e) {
        setRestrictions([]);
      } finally {
        setLoading(false);
      }
    }
    if (open) fetchRestrictions();
  }, [open]);

  async function handleSave() {
    if (!form.title || !form.description) return;

    setUploading(true);
    try {
      // 1. Primeiro, salvar os dados da receita sem a imagem
      const recipeId = await CreateRecipeAction.execute(
        {
          title: form.title,
          description: form.description,
          img: "", // Inicialmente vazio
        },
        form.restrictions
      );

      // 2. Se há um arquivo selecionado, fazer upload e atualizar a receita
      if (selectedFile) {
        const imageUrl = await UploadImageAction.execute(
          selectedFile,
          "cozinha_inclusiva",
          "recipes",
          `recipe-${recipeId}` // Nome baseado no ID da receita
        );

        // 3. Atualizar a receita com a URL da imagem
        await CreateRecipeAction.updateImage(recipeId, imageUrl);
      }

      // 4. Callback para recarregar dados na página pai
      onAddRecipe?.();

      setForm(initStateForm);
      setSelectedFile(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar receita:", error);
      alert("Erro ao salvar receita. Tente novamente.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Adicionar Receita</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para criar uma nova receita.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <div className="grid grid-cols-1 gap-4 py-2">
            <div className="grid w-full gap-1">
              <Label htmlFor="title" className="text-gray-500 pl-1">
                Título da receita
              </Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                id="title"
              />
            </div>
            <div className="grid w-full gap-1">
              <Label htmlFor="img" className="text-gray-500 pl-1">
                Imagem da receita
              </Label>
              <Input
                type="file"
                accept="image/*"
                id="img"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedFile(file);
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setForm({ ...form, img: event.target?.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {form.img && (
                <div className="mt-2">
                  <Image
                    src={form.img}
                    alt="Preview da receita"
                    width={128}
                    height={128}
                    className="object-cover rounded border"
                  />
                </div>
              )}
            </div>
            <div className="grid w-full gap-1">
              <Label className="text-gray-500 pl-1">
                Restrições alimentares
              </Label>
              <div className="flex flex-wrap gap-2">
                {loading && <span>Carregando...</span>}
                {!loading && restrictions.length === 0 && (
                  <span>Nenhuma restrição</span>
                )}
                {!loading &&
                  restrictions.map((r) => (
                    <label key={r.id} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={form.restrictions.includes(r.id!)}
                        onChange={(e) => {
                          setForm((prev) => {
                            const checked = e.target.checked;
                            const id = r.id!;
                            return {
                              ...prev,
                              restrictions: checked
                                ? [...prev.restrictions, id]
                                : prev.restrictions.filter((rid) => rid !== id),
                            };
                          });
                        }}
                      />
                      {r.name}
                    </label>
                  ))}
              </div>
            </div>
            <div className="grid w-full gap-1">
              <Label htmlFor="description" className="text-gray-500 pl-1">
                Descrição
              </Label>
              <textarea
                id="description"
                className="border rounded px-2 py-1 min-h-[80px]"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="default" onClick={handleSave} disabled={uploading}>
            {uploading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
