"use client";

import { useState, useEffect } from "react";

import { maskCep, maskPhone } from "@/lib/mask";
import { GetRestaurantLocationByRestaurantIdAction } from "@/Actions/RestaurantLocation/GetRestaurantLocationByRestaurantIdAction";
import { generateSlug } from "@/lib/utils";
import { ListRestrictionsAction } from "@/Actions/Restriction/ListRestrictionsAction";
import { ListRestaurantRestrictionsAction } from "@/Actions/RestaurantRestriction/ListRestaurantRestrictionsAction";
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

export interface Restaurant {
  id: number;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  site: string;
  description: string;
  cep: string;
  uf: string;
  city: string;
  district: string;
  street: string;
  number: string;
  restrictions?: number[];
  slug: string;
}

interface EditRestaurantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurant: Restaurant;
  onUpdateRestaurant: (restaurant: Restaurant) => void;
}

export default function EditRestaurantDialog({
  open,
  onOpenChange,
  restaurant,
  onUpdateRestaurant,
}: EditRestaurantDialogProps) {
  const [form, setForm] = useState<Restaurant>(restaurant);

  // Sincroniza form ao abrir novo restaurante para edição e busca endereço
  useEffect(() => {
    async function fetchAndSetLocation() {
      setForm(restaurant);
      if (restaurant.id) {
        const location =
          await GetRestaurantLocationByRestaurantIdAction.execute(
            restaurant.id
          );
        if (location) {
          setForm((prev) => ({
            ...prev,
            cep: location.cep ?? "",
            uf: location.uf ?? "",
            city: location.city ?? "",
            district: location.neighborhood ?? "",
            street: location.street ?? "",
            number: location.number ?? "",
          }));
        }
      }
    }
    fetchAndSetLocation();
  }, [restaurant, open]);
  const [activeTab, setActiveTab] = useState<
    "dados" | "endereco" | "restricoes"
  >("dados");
  const [restrictions, setRestrictions] = useState<Restriction[]>([]);
  const [loadingRestrictions, setLoadingRestrictions] = useState(false);

  // Carregar restrições e vínculos do restaurante ao abrir modal
  useEffect(() => {
    async function fetchRestrictions() {
      setLoadingRestrictions(true);
      try {
        const [allRestrictions, restaurantRestrictionIds] = await Promise.all([
          ListRestrictionsAction.execute(),
          ListRestaurantRestrictionsAction.execute(restaurant.id),
        ]);
        setRestrictions(allRestrictions);
        setForm((prev) => ({
          ...prev,
          restrictions: restaurantRestrictionIds.map(Number),
        }));
      } catch {
        setRestrictions([]);
      } finally {
        setLoadingRestrictions(false);
      }
    }
    if (open && activeTab === "restricoes") fetchRestrictions();
  }, [open, activeTab, restaurant.id]);

  async function handleSave() {
    if (!form.name) {
      alert("O nome do restaurante é obrigatório.");
      return;
    }
    const slug = generateSlug(form.name);
    await onUpdateRestaurant({ ...form, id: restaurant.id, slug });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[950px]">
        <DialogHeader>
          <DialogTitle>Editar Restaurante</DialogTitle>
          <DialogDescription>
            Altere os dados abaixo para editar o restaurante.
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 ${
              activeTab === "dados"
                ? "border-b-2 border-blue-500 font-semibold"
                : ""
            }`}
            onClick={() => setActiveTab("dados")}
          >
            Dados
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "endereco"
                ? "border-b-2 border-blue-500 font-semibold"
                : ""
            }`}
            onClick={() => setActiveTab("endereco")}
          >
            Endereço
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "restricoes"
                ? "border-b-2 border-blue-500 font-semibold"
                : ""
            }`}
            onClick={() => setActiveTab("restricoes")}
          >
            Restrições
          </button>
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === "dados" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="grid w-full gap-1">
              <Label htmlFor="name" className="text-gray-500 pl-1">
                Nome do restaurante
              </Label>
              <Input
                value={form.name ?? ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                id="name"
              />
            </div>

            <div className="grid w-full gap-1">
              <Label htmlFor="phone" className="text-gray-500 pl-1">
                Telefone
              </Label>
              <Input
                value={form.phone ?? ""}
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
                value={form.whatsapp ?? ""}
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
                value={form.email ?? ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                id="email"
              />
            </div>

            <div className="grid w-full gap-1">
              <Label htmlFor="site" className="text-gray-500 pl-1">
                Site
              </Label>
              <Input
                value={form.site ?? ""}
                onChange={(e) => setForm({ ...form, site: e.target.value })}
                id="site"
              />
            </div>

            <div className="grid w-full gap-1">
              <Label htmlFor="description" className="text-gray-500 pl-1">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={form.description ?? ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
          </div>
        )}

        {activeTab === "endereco" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="grid w-full gap-1">
              <Label htmlFor="cep" className="text-gray-500 pl-1">
                CEP
              </Label>
              <Input
                value={form.cep ?? ""}
                onChange={(e) =>
                  setForm({ ...form, cep: maskCep(e.target.value) })
                }
                id="cep"
                maxLength={9}
                placeholder="00000-000"
              />
            </div>

            <div className="grid w-full gap-1">
              <Label htmlFor="uf" className="text-gray-500 pl-1">
                UF
              </Label>
              <Input
                value={form.uf ?? ""}
                onChange={(e) => setForm({ ...form, uf: e.target.value })}
                id="uf"
              />
            </div>

            <div className="grid w-full gap-1">
              <Label htmlFor="city" className="text-gray-500 pl-1">
                Cidade
              </Label>
              <Input
                value={form.city ?? ""}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                id="city"
              />
            </div>

            <div className="grid w-full gap-1">
              <Label htmlFor="district" className="text-gray-500 pl-1">
                Bairro
              </Label>
              <Input
                value={form.district ?? ""}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                id="district"
              />
            </div>

            <div className="grid w-full gap-1">
              <Label htmlFor="street" className="text-gray-500 pl-1">
                Logradouro
              </Label>
              <Input
                value={form.street ?? ""}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                id="street"
              />
            </div>

            <div className="grid w-full gap-1">
              <Label htmlFor="number" className="text-gray-500 pl-1">
                Número
              </Label>
              <Input
                value={form.number ?? ""}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
                id="number"
              />
            </div>
          </div>
        )}

        {activeTab === "restricoes" && (
          <div className="grid grid-cols-1 gap-2 py-2">
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
                      checked={
                        Array.isArray(form.restrictions) &&
                        typeof r.id === "number" &&
                        form.restrictions.includes(r.id)
                      }
                      onChange={(e) => {
                        setForm((prev) => {
                          const checked = e.target.checked;
                          const id = r.id;
                          let restrictions: number[] = Array.isArray(
                            prev.restrictions
                          )
                            ? prev.restrictions.filter(
                                (v): v is number => typeof v === "number"
                              )
                            : [];
                          if (typeof id === "number") {
                            restrictions = checked
                              ? [...restrictions, id]
                              : restrictions.filter((rid) => rid !== id);
                          }
                          return {
                            ...prev,
                            restrictions,
                          };
                        });
                      }}
                    />
                    {r.name}
                  </label>
                ))}
            </div>
          </div>
        )}

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
