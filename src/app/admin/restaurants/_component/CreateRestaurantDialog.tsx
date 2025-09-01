"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface CreateRestaurantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRestaurant?: (restaurant: { name: string; email: string }) => void;
}

const initStateForm = {
  name: "",
  phone: "",
  whatsapp: "",
  email: "",
  site: "",
  description: "",
  cep: "",
  uf: "",
  city: "",
  district: "",
  street: "",
  number: "",
};

export default function CreateRestaurantDialog({
  open,
  onOpenChange,
  onAddRestaurant,
}: CreateRestaurantDialogProps) {
  const [form, setForm] = useState<typeof initStateForm>(initStateForm);

  function handleSave() {
    if (!form.name || !form.email) return;
    onAddRestaurant?.(form);
    setForm(initStateForm);
    onOpenChange(false); // fecha o modal
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[950px]">
        <DialogHeader>
          <DialogTitle>Adicionar Restaurante</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para criar um novo restaurante.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="grid w-full gap-1">
              <Label htmlFor="name" className="text-gray-500 pl-1">
                Nome do restaurante
              </Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                id="name"
              />
            </div>

            <div className="grid w-full gap-1">
              <Label htmlFor="phone" className="text-gray-500 pl-1">
                Telefone
              </Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                id="phone"
              />
            </div>

            <div className="grid w-full gap-1">
              <Label htmlFor="whatsapp" className="text-gray-500 pl-1">
                Whatsapp
              </Label>
              <Input
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                id="whatsapp"
              />
            </div>

            <div className="grid w-full gap-1">
              <Label htmlFor="email" className="text-gray-500 pl-1">
                E-mail
              </Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                id="email"
              />
            </div>

            <div className="grid w-full gap-1">
              <Label htmlFor="site" className="text-gray-500 pl-1">
                Site
              </Label>
              <Input
                value={form.site}
                onChange={(e) => setForm({ ...form, site: e.target.value })}
                id="site"
              />
            </div>
          </div>

          <div className="grid w-full gap-1 py-2">
            <Label htmlFor="description" className="text-gray-500 pl-1">
              Descrição
            </Label>
            <Textarea
              placeholder="descrição do restaurante"
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="grid w-full gap-1">
              <Label htmlFor="cep" className="text-gray-500 pl-1">
                CEP
              </Label>
              <Input
                value={form.cep}
                onChange={(e) => setForm({ ...form, cep: e.target.value })}
              />
            </div>

            <div className="grid w-full gap-1">
              <Label htmlFor="uf" className="text-gray-500 pl-1">
                UF
              </Label>
              <Input
                value={form.uf}
                onChange={(e) => setForm({ ...form, uf: e.target.value })}
              />
            </div>

            <div className="grid w-full gap-1">
              <Label htmlFor="cidade" className="text-gray-500 pl-1">
                Cidade
              </Label>
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>

            <div className="grid w-full gap-1">
              <Label htmlFor="bairro" className="text-gray-500 pl-1">
                Bairro
              </Label>
              <Input
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
              />
            </div>

            <div className="grid w-full gap-1">
              <Label htmlFor="logradouro" className="text-gray-500 pl-1">
                Logradouro
              </Label>
              <Input
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
              />
            </div>

            <div className="grid w-full gap-1">
              <Label htmlFor="numero" className="text-gray-500 pl-1">
                Número
              </Label>
              <Input
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
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
