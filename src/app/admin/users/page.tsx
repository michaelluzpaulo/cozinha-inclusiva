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
import CreateUserDialog from "./_component/CreateUserDialog";
import EditUserDialog from "./_component/EditUserDialog";
import { User } from "@/Contracts/User";

export default function UsersPage() {
  const [queryId, setQueryId] = useState("");
  const [queryName, setQueryName] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, queryId, queryName]);

  async function loadUsers() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/users?active=true");
      if (!response.ok) throw new Error("Erro ao buscar usuários");

      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function filterUsers() {
    const filtered = users.filter((user) => {
      const matchId = queryId ? user.id === Number(queryId) : true;
      const matchName = queryName
        ? user.name.toLowerCase().includes(queryName.toLowerCase())
        : true;
      return matchId && matchName;
    });
    setFilteredUsers(filtered);
  }

  function handleSearch() {
    filterUsers();
  }

  function handleCreateUser() {
    setIsCreateUserDialogOpen(true);
  }

  function handleEditUser(user: User) {
    setSelectedUser(user);
    setIsEditUserDialogOpen(true);
  }

  async function handleDeleteUser(user: User) {
    if (!user.id) return;

    const confirmed = confirm(
      `Tem certeza que deseja desativar o usuário "${user.name}"?`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao desativar usuário");

      loadUsers(); // Recarregar lista
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      alert("Erro ao desativar usuário");
    }
  }

  function handleUserCreated() {
    loadUsers();
  }

  function handleUserUpdated() {
    loadUsers();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Card className="space-y-4">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Usuários</h2>
          <Button variant="default" size="sm" onClick={handleCreateUser}>
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
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-sm text-gray-500"
                  >
                    Carregando usuários...
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="w-16 text-center">
                        {user.id}
                      </TableCell>
                      <TableCell className="min-w-0">
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                          <div className="text-xs text-gray-400">
                            {user.roleName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-1 justify-center w-24">
                          <Button
                            variant="outline"
                            size="sm"
                            title="Editar"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            title="Desativar"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {filteredUsers.length === 0 && !isLoading && (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-sm text-gray-500"
                      >
                        Nenhum usuário encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <CreateUserDialog
        open={isCreateUserDialogOpen}
        onOpenChange={setIsCreateUserDialogOpen}
        onUserCreated={handleUserCreated}
      />

      <EditUserDialog
        open={isEditUserDialogOpen}
        onOpenChange={setIsEditUserDialogOpen}
        user={selectedUser}
        onUserUpdated={handleUserUpdated}
      />
    </div>
  );
}
