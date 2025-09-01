"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Edit, Trash2, Plus } from "lucide-react";
import CreateRestaurantDialog from "./_component/CreateRestaurantDialog";
import EditRestaurantDialog, {
  Restaurant,
} from "./_component/EditRestaurantDialog";
import { Restaurantes } from "@/lib/restaurantes";

export default function UsersPage() {
  const [queryId, setQueryId] = useState("");
  const [queryName, setQueryName] = useState("");
  const [isCreateRestaurantDialogOpen, setIsCreateRestaurantDialogOpen] =
    useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editRestaurant, setEditRestaurant] = useState<Restaurant | null>(null);

  const [restaurantes, setRestaurantes] = useState(Restaurantes);

  const filteredRestaurantes = restaurantes.filter((restaurant) => {
    const matchId = queryId ? restaurant.id === Number(queryId) : true;
    const matchName = queryName
      ? restaurant.name.toLowerCase().includes(queryName.toLowerCase())
      : true;
    return matchId && matchName;
  });

  function handleSearch() {
    // opcional: triggerar pesquisa via API
    console.log("Pesquisar", queryId, queryName);
  }

  function handleCreateRestaurant() {
    setIsCreateRestaurantDialogOpen(true);
  }

  function handleEditRestaurant(restaurant: any) {
    // Corrige campos para o tipo Restaurant
    setEditRestaurant({
      id: restaurant.id,
      name: restaurant.name,
      phone: restaurant.phone,
      whatsapp: restaurant.whats || restaurant.whatsapp || "",
      email: restaurant.email,
      site: restaurant.site,
      description: restaurant.description,
      cep: restaurant.cep,
      uf: restaurant.uf,
      city: restaurant.city,
      district: restaurant.neighborhood || restaurant.district || "",
      street: restaurant.street,
      number: restaurant.number || "",
      restrictions: restaurant.restrictions || "",
    });
    setIsEditDialogOpen(true);
  }

  function handleUpdateRestaurant(updated: Restaurant) {
    setRestaurantes((prev) =>
      prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r))
    );
    setIsEditDialogOpen(false);
    setEditRestaurant(null);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Card className="space-y-4">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Restaurantes</h2>
          <Button variant="default" size="sm" onClick={handleCreateRestaurant}>
            <Plus size={16} className="mr-1" /> Adicionar
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pesquisa */}
          <div className="flex gap-2">
            <Input
              placeholder="Pesquisar por ID"
              type="number"
              value={queryId}
              onChange={(e) => setQueryId(e.target.value)}
            />
            <Input
              placeholder="Pesquisar por Nome"
              value={queryName}
              onChange={(e) => setQueryName(e.target.value)}
            />
            <Button variant="default" onClick={handleSearch}>
              Pesquisar
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 text-center">ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Restrições</TableHead>
                <TableHead className="w-24 text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRestaurantes.map((restaurant) => (
                <TableRow key={restaurant.id}>
                  <TableCell className="w-16 text-center">
                    {restaurant.id}
                  </TableCell>
                  <TableCell className="min-w-0">{restaurant.name}</TableCell>
                  <TableCell className="min-w-0">{restaurant.phone}</TableCell>
                  <TableCell className="min-w-0">{restaurant.whats}</TableCell>
                  <TableCell className="min-w-0">
                    {restaurant.restrictions}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-1 justify-center w-24">
                      <Button
                        variant="outline"
                        size="sm"
                        title="Editar"
                        onClick={() => handleEditRestaurant(restaurant)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button variant="destructive" size="sm" title="Excluir">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {filteredRestaurantes.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-sm text-gray-500"
                  >
                    Nenhum restaurante encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <CreateRestaurantDialog
        open={isCreateRestaurantDialogOpen}
        onOpenChange={setIsCreateRestaurantDialogOpen}
        // onAddRestaurant={handleAddRestaurant}
      />
      {editRestaurant && (
        <EditRestaurantDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          restaurant={editRestaurant}
          onUpdateRestaurant={handleUpdateRestaurant}
        />
      )}
    </div>
  );
}
