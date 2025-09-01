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
import CreateRecipeDialog from "./_component/CreateRecipeDialog";
import EditRecipeDialog, { Recipe } from "./_component/EditRecipeDialog";
import { Recipes } from "@/lib/recipes";

export default function RecipesPage() {
  const [queryId, setQueryId] = useState("");
  const [queryName, setQueryName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState(Recipes);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchId = queryId ? recipe.id === Number(queryId) : true;
    const matchName = queryName
      ? recipe.name.toLowerCase().includes(queryName.toLowerCase())
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

  function handleEditRecipe(recipe: any) {
    setEditRecipe({
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      restrictions: recipe.restrictions || "",
    });
    setIsEditDialogOpen(true);
  }

  function handleUpdateRecipe(updated: Recipe) {
    setRecipes((prev) =>
      prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r))
    );
    setIsEditDialogOpen(false);
    setEditRecipe(null);
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
                  <TableCell className="min-w-0">{recipe.name}</TableCell>
                  <TableCell className="min-w-0">
                    {recipe.description}
                  </TableCell>
                  <TableCell className="min-w-0">
                    {recipe.restrictions}
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
        // onAddRecipe={handleAddRecipe}
      />
      {editRecipe && (
        <EditRecipeDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          recipe={editRecipe}
          onUpdateRecipe={handleUpdateRecipe}
        />
      )}
    </div>
  );
}
