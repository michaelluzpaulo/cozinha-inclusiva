"use client";

import { useState, useEffect } from "react";

import { maskCep, maskPhone } from "@/lib/mask";
import { ListRestrictionsAction } from "@/Actions/Restriction/ListRestrictionsAction";
import type { Restriction } from "@/Contracts/Restriction";
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
import { generateSlug } from "@/lib/utils";
import ImageUpload from "@/components/ImageUpload";
import { CreateRestaurantAction } from "@/Actions/Restaurant/CreateRestaurantAction";

interface CreateRestaurantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRestaurant?: (restaurant: {
    name: string;
    email: string;
    phone: string;
    whatsapp: string;
    site: string;
    description: string;
    cep: string;
    uf: string;
    city: string;
    district: string;
    street: string;
    number: string;
    restrictions: number[];
    user_id: number;
    slug: string;
  }) => void;
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
  img: "",
  restrictions: [] as number[],
};

export default function CreateRestaurantDialog({
  open,
  onOpenChange,
  onAddRestaurant,
}: CreateRestaurantDialogProps) {
  const [form, setForm] = useState<typeof initStateForm>(initStateForm);
  const [restrictions, setRestrictions] = useState<Restriction[]>([]);
  const [loadingRestrictions, setLoadingRestrictions] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchRestrictions() {
      setLoadingRestrictions(true);
      try {
        const data = await ListRestrictionsAction.execute();
        setRestrictions(data);
      } catch {
        setRestrictions([]);
      } finally {
        setLoadingRestrictions(false);
      }
    }
    if (open) fetchRestrictions();
  }, [open]);

  // Debug: Log sempre que form.img mudar
  useEffect(() => {
    console.log("Form.img atualizado:", form.img);
  }, [form.img]);

  async function handleSave() {
    if (!form.name) {
      alert("O nome do restaurante é obrigatório.");
      return;
    }

    console.log("Form data antes do save (restaurant):", form);

    setSaving(true);
    try {
      // Gera slug a partir do nome
      const slug = generateSlug(form.name);
      const restaurantData = { ...form, user_id: 1, slug };

      console.log(
        "Dados que serão enviados para CreateRestaurantAction:",
        restaurantData
      );

      await CreateRestaurantAction.execute(restaurantData);
      onAddRestaurant?.(restaurantData);
      setForm(initStateForm);
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar restaurante:", error);
      alert("Erro ao salvar restaurante. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[950px] max-h-[80vh] overflow-y-auto">
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
                onChange={(e) =>
                  setForm({ ...form, phone: maskPhone(e.target.value) })
                }
                id="phone"
                maxLength={15}
                placeholder="(99) 99999-9999"
              />
            </div>

            <div className="grid w-full gap-1">
              <Label htmlFor="whatsapp" className="text-gray-500 pl-1">
                Whatsapp
              </Label>
              <Input
                value={form.whatsapp}
                onChange={(e) =>
                  setForm({ ...form, whatsapp: maskPhone(e.target.value) })
                }
                id="whatsapp"
                maxLength={15}
                placeholder="(99) 99999-9999"
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

          <div className="grid w-full gap-1 py-2">
            <Label className="text-gray-500 pl-1">Imagem do restaurante</Label>
            <ImageUpload
              currentImage={form.img}
              onUpload={async (file: File) => {
                const formData = new FormData();
                formData.append("file", file);
                const response = await fetch("/api/upload/restaurant", {
                  method: "POST",
                  body: formData,
                });
                if (!response.ok) throw new Error("Erro no upload");
                const data = await response.json();
                return data.imageUrl;
              }}
              onImageChange={(imageUrl) => {
                console.log("onImageChange chamado - imageUrl:", imageUrl);
                console.log("Form atual antes da atualização:", form);
                const newForm = { ...form, img: imageUrl || "" };
                console.log("Novo form após atualização:", newForm);
                setForm(newForm);
              }}
              accept="image/*"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="grid w-full gap-1">
              <Label htmlFor="cep" className="text-gray-500 pl-1">
                CEP
              </Label>
              <Input
                value={form.cep}
                onChange={(e) =>
                  setForm({ ...form, cep: maskCep(e.target.value) })
                }
                maxLength={9}
                placeholder="00000-000"
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

        {/* Restrições alimentares */}
        <div className="grid w-full gap-1 py-2">
          <Label className="text-gray-500 pl-1">Restrições alimentares</Label>
          <div className="flex flex-wrap gap-2">
            {loadingRestrictions && <span>Carregando...</span>}
            {!loadingRestrictions && restrictions.length === 0 && (
              <span>Nenhuma restrição cadastrada</span>
            )}
            {!loadingRestrictions &&
              restrictions.map((r) => (
                <label key={r.id} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={form.restrictions.includes(r.id!)}
                    onChange={(e) => {
                      setForm((prev) => {
                        const checked = e.target.checked;
                        const id = r.id!;
                        const restrictions = checked
                          ? [...prev.restrictions, id]
                          : prev.restrictions.filter((rid) => rid !== id);
                        return {
                          ...prev,
                          restrictions: restrictions.filter(
                            (v): v is number => typeof v === "number"
                          ),
                        };
                      });
                    }}
                  />
                  {r.name}
                </label>
              ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="default" onClick={handleSave} disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
