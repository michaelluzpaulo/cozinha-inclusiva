"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ListRestrictionsAction } from "@/Actions/Restriction/ListRestrictionsAction";
import { UpdateRecipeAction } from "@/Actions/Recipe/UpdateRecipeAction";
import ImageUpload from "@/components/ImageUpload";
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

import type { Recipe } from "@/Contracts/Recipe";
import type { Restriction } from "@/Contracts/Restriction";

type RecipeWithRestrictions = Required<Recipe> & { restrictions: number[] };

interface EditRecipeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: RecipeWithRestrictions;
  onUpdateRecipe: () => void; // Simplificado - apenas callback para recarregar dados
}

export default function EditRecipeDialog({
  open,
  onOpenChange,
  recipe,
  onUpdateRecipe,
}: EditRecipeDialogProps) {
  const [form, setForm] = useState<RecipeWithRestrictions>({
    id: recipe.id,
    title: recipe.title,
    description: recipe.description ?? "",
    img: recipe.img ?? "",
    restrictions: recipe.restrictions ?? [],
  });
  const [restrictions, setRestrictions] = useState<Restriction[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Sincroniza o form sempre que a receita recebida mudar
  useEffect(() => {
    setForm({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description ?? "",
      img: recipe.img ?? "",
      restrictions: recipe.restrictions ?? [],
    });
  }, [recipe]);

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
      await UpdateRecipeAction.execute(form, form.restrictions);
      onUpdateRecipe();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao atualizar receita:", error);
      alert("Erro ao atualizar receita. Tente novamente.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Receita</DialogTitle>
          <DialogDescription>
            Altere os dados abaixo para editar a receita.
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
              <Label className="text-gray-500 pl-1">Imagem da receita</Label>
              <ImageUpload
                currentImage={form.img}
                onUpload={async (file: File) => {
                  const formData = new FormData();
                  formData.append("file", file);
                  const response = await fetch("/api/upload/recipe", {
                    method: "POST",
                    body: formData,
                  });
                  if (!response.ok) throw new Error("Erro no upload");
                  const data = await response.json();
                  return data.imageUrl;
                }}
                onImageChange={(imageUrl) =>
                  setForm({ ...form, img: imageUrl || "" })
                }
                accept="image/*"
              />
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
