export interface User {
  id?: number;
  name: string;
  active?: boolean;
  email: string;
  password?: string; // Opcional para não retornar em consultas
  role_id: number;
  roleId?: number; // Compatibilidade com schema Drizzle
  created_at?: string;
  updated_at?: string;
  createdAt?: string; // Compatibilidade com schema Drizzle
  updatedAt?: string; // Compatibilidade com schema Drizzle
  roleName?: string; // Para exibição do nome da role
}
