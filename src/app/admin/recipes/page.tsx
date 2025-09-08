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
import CreateRecipeDialog from "./_component/CreateRecipeDialog";
import { CreateRecipeAction } from "@/Actions/Recipe/CreateRecipeAction";
import EditRecipeDialog from "./_component/EditRecipeDialog";
import { UpdateRecipeAction } from "@/Actions/Recipe/UpdateRecipeAction";
import type { Recipe as RecipeBase } from "@/Contracts/Recipe";
type Recipe = RecipeBase & { restrictions: number[] };
import { ListRestrictionsAction } from "@/Actions/Restriction/ListRestrictionsAction";
import { ListRecipesAction } from "@/Actions/Recipe/ListRecipesAction";

export default function RecipesPage() {
  const [queryId, setQueryId] = useState("");
  const [queryName, setQueryName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [restrictions, setRestrictions] = useState<
    { id: number; name: string }[]
  >([]);

  // Carregar receitas e restrições do banco
  useEffect(() => {
    async function fetchData() {
      try {
        const [recipesData, restrictionsData] = await Promise.all([
          ListRecipesAction.execute(),
          ListRestrictionsAction.execute(),
        ]);
        setRecipes(recipesData);
        setRestrictions(
          restrictionsData.map((r: any) => ({ id: r.id, name: r.name }))
        );
      } catch {
        setRecipes([]);
        setRestrictions([]);
      }
    }
    fetchData();
  }, []);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchId = queryId ? recipe.id === Number(queryId) : true;
    const matchName = queryName
      ? (recipe.title || "").toLowerCase().includes(queryName.toLowerCase())
      : true;
    return matchId && matchName;
  });

  function handleSearch() {
    // opcional: triggerar pesquisa via API
    console.log("Pesquisar", queryId, queryName);
  }

  function handleCreateRecipe() {
    setIsCreateDialogOpen(true);
  }

  function handleEditRecipe(recipe: Recipe) {
    setEditRecipe(recipe);
    setIsEditDialogOpen(true);
  }

  async function handleUpdateRecipe(updated: Recipe) {
    // Atualiza no banco e recarrega a lista
    await UpdateRecipeAction.execute(
      {
        id: updated.id,
        title: updated.title,
        description: updated.description,
      },
      updated.restrictions
    );
    const recipesData = await ListRecipesAction.execute();
    setRecipes(recipesData);
    setIsEditDialogOpen(false);
    setEditRecipe(null);
  }

  async function handleAddRecipe(
    recipe: { title: string; description: string },
    restrictions: number[]
  ) {
    await CreateRecipeAction.execute(recipe, restrictions);
    const recipesData = await ListRecipesAction.execute();
    setRecipes(recipesData);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Card className="space-y-4">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Receitas</h2>
          <Button variant="default" size="sm" onClick={handleCreateRecipe}>
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
                <TableHead>Descrição</TableHead>
                <TableHead>Restrições</TableHead>
                <TableHead className="w-24 text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredRecipes.map((recipe) => (
                <TableRow key={recipe.id}>
                  <TableCell className="w-16 text-center">
                    {recipe.id}
                  </TableCell>
                  <TableCell className="min-w-0">{recipe.title}</TableCell>
                  <TableCell className="min-w-0">
                    {recipe.description}
                  </TableCell>
                  <TableCell className="min-w-0">
                    {Array.isArray(recipe.restrictions)
                      ? recipe.restrictions
                          .map(
                            (id: number) =>
                              restrictions.find((r) => r.id === id)?.name || id
                          )
                          .join(", ")
                      : ""}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-1 justify-center w-24">
                      <Button
                        variant="outline"
                        size="sm"
                        title="Editar"
                        onClick={() => handleEditRecipe(recipe)}
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

              {filteredRecipes.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-sm text-gray-500"
                  >
                    Nenhuma receita encontrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <CreateRecipeDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onAddRecipe={handleAddRecipe}
      />
      {editRecipe && (
        <EditRecipeDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          recipe={{
            ...editRecipe,
            id: editRecipe.id ?? 0,
            description: editRecipe.description ?? "",
          }}
          onUpdateRecipe={handleUpdateRecipe}
        />
      )}
    </div>
  );
}
