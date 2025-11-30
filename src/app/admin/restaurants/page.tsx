"use client";

import { useState, useEffect } from "react";
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
  Restaurant as AdminRestaurant,
} from "./_component/EditRestaurantDialog";
import { ListRestaurantsAction } from "@/Actions/Restaurant/ListRestaurantsAction";
import { ListRestrictionsAction } from "@/Actions/Restriction/ListRestrictionsAction";
import { ListRestaurantRestrictionsAction } from "@/Actions/RestaurantRestriction/ListRestaurantRestrictionsAction";
import { CreateRestaurantAction } from "@/Actions/Restaurant/CreateRestaurantAction";
import { UpdateRestaurantAction } from "@/Actions/Restaurant/UpdateRestaurantAction";
import { UpdateRestaurantLocationAction } from "@/Actions/RestaurantLocation/UpdateRestaurantLocationAction";
import { UpdateRestaurantRestrictionsAction } from "@/Actions/Restaurant/UpdateRestaurantRestrictionsAction";
import { CreateRestaurantLocationAction } from "@/Actions/RestaurantLocation/CreateRestaurantLocationAction";
import { GetRestaurantLocationByRestaurantIdAction } from "@/Actions/RestaurantLocation/GetRestaurantLocationByRestaurantIdAction";
import { UpdateRestaurantRestrictionAction } from "@/Actions/RestaurantRestriction/UpdateRestaurantRestrictionAction";

export default function RestaurantsPage() {
  const [isCreateRestaurantDialogOpen, setIsCreateRestaurantDialogOpen] =
    useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editRestaurant, setEditRestaurant] = useState<AdminRestaurant | null>(
    null
  );
  const [restaurantes, setRestaurantes] = useState<AdminRestaurant[]>([]);
  const [restrictions, setRestrictions] = useState<
    { id: number; name: string }[]
  >([]);
  const [restaurantRestrictions, setRestaurantRestrictions] = useState<
    Record<number, number[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [queryId, setQueryId] = useState("");
  const [queryName, setQueryName] = useState("");

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const [restaurantsData, restrictionsData] = await Promise.all([
          ListRestaurantsAction.execute(),
          ListRestrictionsAction.execute(),
        ]);
        // Normaliza para o tipo AdminRestaurant
        const adminRestaurants: AdminRestaurant[] = restaurantsData.map(
          (r: any) => ({
            id: r.id,
            name: r.name ?? "",
            phone: r.phone ?? "",
            whatsapp: r.whatsapp ?? "",
            email: r.email ?? "",
            site: r.site ?? "",
            description: r.description ?? "",
            img: r.img ?? "",
            cep: r.cep ?? "",
            uf: r.uf ?? "",
            city: r.city ?? "",
            district: r.district ?? r.neighborhood ?? "",
            street: r.street ?? "",
            number: r.number ?? "",
            slug: r.slug ?? "",
            restrictions: [],
          })
        );
        setRestaurantes(adminRestaurants);
        setRestrictions(
          restrictionsData.map((r: any) => ({ id: r.id, name: r.name }))
        );
        // Buscar restrições de todos os restaurantes
        const restrictionsMap: Record<number, number[]> = {};
        await Promise.all(
          adminRestaurants.map(async (r: any) => {
            const ids = await ListRestaurantRestrictionsAction.execute(r.id);
            restrictionsMap[r.id] = ids;
          })
        );
        setRestaurantRestrictions(restrictionsMap);
      } catch (err: any) {
        setError("Erro ao carregar restaurantes");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

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

  function handleEditRestaurant(restaurant: AdminRestaurant) {
    setEditRestaurant(restaurant);
    setIsEditDialogOpen(true);
  }

  async function handleUpdateRestaurant(updated: AdminRestaurant) {
    try {
      console.log("🔧 handleUpdateRestaurant - Dados recebidos:", updated);

      // Atualiza restaurante (campos principais)
      await UpdateRestaurantAction.execute(updated.id, {
        name: updated.name,
        phone: updated.phone,
        whatsapp: updated.whatsapp,
        email: updated.email,
        site: updated.site,
        description: updated.description,
        img: updated.img,
      });

      // Atualiza restrictions do restaurante
      await UpdateRestaurantRestrictionsAction.execute(
        updated.id,
        updated.restrictions || []
      );

      // Atualiza ou cria endereço (restaurant_locations)
      const location = await GetRestaurantLocationByRestaurantIdAction.execute(
        updated.id
      );
      if (location && location.id) {
        await UpdateRestaurantLocationAction.execute(location.id, {
          cep: updated.cep,
          uf: updated.uf,
          city: updated.city,
          neighborhood: updated.district,
          street: updated.street,
          number: updated.number,
        });
      } else {
        await CreateRestaurantLocationAction.execute({
          restaurant_id: updated.id,
          cep: updated.cep,
          uf: updated.uf,
          city: updated.city,
          neighborhood: updated.district,
          street: updated.street,
          number: updated.number,
        });
      }

      // Atualiza restrições (restaurant_restriction)
      const restrictionIds = (updated.restrictions || []).map(Number);
      await UpdateRestaurantRestrictionAction.execute(
        updated.id,
        restrictionIds
      );

      await reloadRestaurantsAndRestrictions();
    } catch (err) {
      setError("Erro ao atualizar restaurante");
    } finally {
      setIsEditDialogOpen(false);
      setEditRestaurant(null);
    }
  }

  // Função utilitária para recarregar e normalizar restaurantes e restrições
  async function reloadRestaurantsAndRestrictions() {
    const [restaurantsData, restrictionsData] = await Promise.all([
      ListRestaurantsAction.execute(),
      ListRestrictionsAction.execute(),
    ]);
    // Normaliza para o tipo AdminRestaurant
    const adminRestaurants: AdminRestaurant[] = restaurantsData.map(
      (r: any) => ({
        id: r.id,
        name: r.name ?? "",
        phone: r.phone ?? "",
        whatsapp: r.whatsapp ?? "",
        email: r.email ?? "",
        site: r.site ?? "",
        description: r.description ?? "",
        img: r.img ?? "",
        cep: r.cep ?? "",
        uf: r.uf ?? "",
        city: r.city ?? "",
        district: r.district ?? r.neighborhood ?? "",
        street: r.street ?? "",
        number: r.number ?? "",
        slug: r.slug ?? "",
        restrictions: [],
      })
    );
    setRestaurantes(adminRestaurants);
    setRestrictions(
      restrictionsData.map((r: any) => ({ id: r.id, name: r.name }))
    );
    // Atualiza vínculos de restrições
    const restrictionsMap: Record<number, number[]> = {};
    await Promise.all(
      adminRestaurants.map(async (r: any) => {
        const ids = await ListRestaurantRestrictionsAction.execute(r.id);
        restrictionsMap[r.id] = ids;
      })
    );
    setRestaurantRestrictions(restrictionsMap);
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
          {loading ? (
            <div className="text-center text-gray-500 py-8">Carregando...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
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
                    <TableCell className="min-w-0">
                      {restaurant.phone || "-"}
                    </TableCell>
                    <TableCell className="min-w-0">
                      {restaurant.whatsapp || "-"}
                    </TableCell>
                    <TableCell className="min-w-0">
                      {Array.isArray(restaurantRestrictions[restaurant.id]) &&
                      restaurantRestrictions[restaurant.id].length > 0
                        ? restaurantRestrictions[restaurant.id]
                            .map(
                              (id) =>
                                restrictions.find((r) => r.id === id)?.name ||
                                id
                            )
                            .join(", ")
                        : "-"}
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
          )}
        </CardContent>
      </Card>
      <CreateRestaurantDialog
        open={isCreateRestaurantDialogOpen}
        onOpenChange={setIsCreateRestaurantDialogOpen}
        onAddRestaurant={async () => {
          await reloadRestaurantsAndRestrictions();
        }}
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
