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
import CreateRestrictionDialog from "./_component/CreateRestrictionDialog";
import EditRestrictionDialog from "./_component/EditRestrictionDialog";
import { Restriction } from "@/Contracts/Restriction";
import { ListRestrictionsAction } from "@/Actions/Restriction/ListRestrictionsAction";
import { CreateRestrictionAction } from "@/Actions/Restriction/CreateRestrictionAction";
import { UpdateRestrictionAction } from "@/Actions/Restriction/UpdateRestrictionAction";
import { DeleteRestrictionAction } from "@/Actions/Restriction/DeleteRestrictionAction";
import { FindRestrictionAction } from "@/Actions/Restriction/FindRestrictionAction";

export default function RestrictionsPage() {
  const [restrictions, setRestrictions] = useState<Restriction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [queryId, setQueryId] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editRestriction, setEditRestriction] = useState<Restriction | null>(
    null
  );

  async function fetchRestrictions() {
    setLoading(true);
    setError(null);
    try {
      const data = await ListRestrictionsAction.execute();
      setRestrictions(data);
    } catch (err: any) {
      setError("Erro ao carregar restrições");
    } finally {
      setLoading(false);
    }
  }

  function handleCreateRestriction() {
    setIsCreateDialogOpen(true);
  }

  async function handleAddRestriction(restriction: {
    name: string;
    description?: string;
    icon?: string;
  }) {
    try {
      await CreateRestrictionAction.execute(restriction);
      fetchRestrictions();
    } catch (err) {
      alert("Erro ao adicionar restrição");
    }
  }

  function handleEditRestriction(restriction: Restriction) {
    setEditRestriction(restriction);
    setIsEditDialogOpen(true);
  }

  async function handleUpdateRestriction(updated: Restriction) {
    try {
      if (!updated.id) return;
      await UpdateRestrictionAction.execute(updated.id, updated);
      fetchRestrictions();
    } catch (err) {
      alert("Erro ao atualizar restrição");
    }
    setIsEditDialogOpen(false);
    setEditRestriction(null);
  }

  async function handleDeleteRestriction(id: number | undefined) {
    if (!id) return;
    if (!window.confirm("Tem certeza que deseja excluir esta restrição?"))
      return;
    try {
      await DeleteRestrictionAction.execute(id);
      fetchRestrictions();
    } catch (err) {
      alert("Erro ao excluir restrição");
    }
  }

  const filteredRestrictions = restrictions.filter((r) => {
    const matchId = queryId ? r.id === Number(queryId) : true;
    const matchName = r.name.toLowerCase().includes(query.toLowerCase());
    return matchId && matchName;
  });

  async function handleSearchById() {
    if (!queryId) {
      fetchRestrictions();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const found = await FindRestrictionAction.execute(Number(queryId));
      setRestrictions(found ? [found] : []);
    } catch (err) {
      setError("Erro ao buscar restrição por ID");
      setRestrictions([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRestrictions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Card className="space-y-4">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Restrições</h2>
          <Button variant="default" size="sm" onClick={handleCreateRestriction}>
            <Plus size={16} className="mr-1" /> Adicionar
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Pesquisar por ID"
              type="number"
              value={queryId}
              onChange={(e) => setQueryId(e.target.value)}
            />
            <Input
              placeholder="Pesquisar por nome"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="default" onClick={handleSearchById}>
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
                  <TableHead>Descrição</TableHead>
                  <TableHead>Ícone</TableHead>
                  <TableHead className="w-24 text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRestrictions.map((restriction) => (
                  <TableRow key={restriction.id}>
                    <TableCell className="w-16 text-center">
                      {restriction.id}
                    </TableCell>
                    <TableCell>{restriction.name}</TableCell>
                    <TableCell>{restriction.description || "-"}</TableCell>
                    <TableCell>{restriction.icon || "-"}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-1 justify-center w-24">
                        <Button
                          variant="outline"
                          size="sm"
                          title="Editar"
                          onClick={() => handleEditRestriction(restriction)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          title="Excluir"
                          onClick={() =>
                            handleDeleteRestriction(restriction.id)
                          }
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRestrictions.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-sm text-gray-500"
                    >
                      Nenhuma restrição encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <CreateRestrictionDialog
        open={isCreateDialogOpen}
        onToggleModal={setIsCreateDialogOpen}
        onAddRestriction={handleAddRestriction}
      />
      {editRestriction && (
        <EditRestrictionDialog
          open={isEditDialogOpen}
          onToggleModal={setIsEditDialogOpen}
          restriction={editRestriction}
          onUpdateRestriction={handleUpdateRestriction}
        />
      )}
    </div>
  );
}
