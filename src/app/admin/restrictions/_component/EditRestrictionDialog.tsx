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
import { Restriction } from "@/Contracts/Restriction";

interface EditRestrictionDialogProps {
  open: boolean;
  onToggleModal: (open: boolean) => void;
  restriction: Restriction;
  onUpdateRestriction: (restriction: Restriction) => void;
}

export default function EditRestrictionDialog({
  open,
  onToggleModal,
  restriction,
  onUpdateRestriction,
}: EditRestrictionDialogProps) {
  const [form, setForm] = useState<Restriction>(restriction);

  function handleSave() {
    if (!form.name) return;
    onUpdateRestriction({ ...form, id: restriction.id });
    onToggleModal(false);
  }

  return (
    <Dialog open={open} onOpenChange={onToggleModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Restrição</DialogTitle>
          <DialogDescription>
            Altere os dados abaixo para editar a restrição.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <div className="grid w-full gap-2">
            <Label htmlFor="name" className="text-gray-500 pl-1">
              Nome
            </Label>
            <Input
              value={form.name ?? ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              id="name"
            />
            <Label htmlFor="description" className="text-gray-500 pl-1">
              Descrição
            </Label>
            <Input
              value={form.description ?? ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              id="description"
            />
            <Label htmlFor="icon" className="text-gray-500 pl-1">
              Ícone (opcional)
            </Label>
            <Input
              value={form.icon ?? ""}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              id="icon"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onToggleModal(false)}>
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
