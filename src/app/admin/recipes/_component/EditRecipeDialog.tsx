"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
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

export interface Recipe {
  id: number;
  name: string;
  description: string;
  restrictions: string;
}

interface EditRecipeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: Recipe;
  onUpdateRecipe: (recipe: Recipe) => void;
}

export default function EditRecipeDialog({
  open,
  onOpenChange,
  recipe,
  onUpdateRecipe,
}: EditRecipeDialogProps) {
  const [form, setForm] = useState<Recipe>(recipe);

  function handleSave() {
    if (!form.name || !form.description) return;
    onUpdateRecipe({ ...form, id: recipe.id });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Editar Receita</DialogTitle>
          <DialogDescription>
            Altere os dados abaixo para editar a receita.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <div className="grid grid-cols-1 gap-4 py-2">
            <div className="grid w-full gap-1">
              <Label htmlFor="name" className="text-gray-500 pl-1">
                Nome da receita
              </Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                id="name"
              />
            </div>
            <div className="grid w-full gap-1">
              <Label htmlFor="description" className="text-gray-500 pl-1">
                Descrição
              </Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                id="description"
              />
            </div>
            <div className="grid w-full gap-1">
              <Label htmlFor="restrictions" className="text-gray-500 pl-1">
                Restrições
              </Label>
              <Input
                value={form.restrictions}
                onChange={(e) =>
                  setForm({ ...form, restrictions: e.target.value })
                }
                id="restrictions"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="default" onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
