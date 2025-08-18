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

// Dados simulados
const USERS = [
  { id: 1, name: "Michael Luz", email: "michael@example.com" },
  { id: 2, name: "Ana Souza", email: "ana@example.com" },
  { id: 3, name: "João Silva", email: "joao@example.com" },
];

export default function UsersPage() {
  const [queryId, setQueryId] = useState("");
  const [queryName, setQueryName] = useState("");

  const filteredUsers = USERS.filter((user) => {
    const matchId = queryId ? user.id === Number(queryId) : true;
    const matchName = queryName
      ? user.name.toLowerCase().includes(queryName.toLowerCase())
      : true;
    return matchId && matchName;
  });

  function handleSearch() {
    // opcional: triggerar pesquisa via API
    console.log("Pesquisar", queryId, queryName);
  }

  function handleAdd() {
    // opcional: abrir modal de adicionar usuário
    console.log("Adicionar novo usuário");
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Card className="space-y-4">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Usuários</h2>
          <Button variant="default" size="sm" onClick={handleAdd}>
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
                <TableHead className="w-24 text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="w-16 text-center">{user.id}</TableCell>
                  <TableCell className="min-w-0">{user.name}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-1 justify-center w-24">
                      <Button variant="outline" size="sm" title="Editar">
                        <Edit size={16} />
                      </Button>
                      <Button variant="destructive" size="sm" title="Excluir">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-sm text-gray-500"
                  >
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
