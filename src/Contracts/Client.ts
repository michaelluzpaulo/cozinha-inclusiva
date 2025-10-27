export interface Client {
  id?: number;
  nome: string; // Mantendo para compatibilidade com frontend
  name?: string; // Nova propriedade para compatibilidade com banco
  email: string;
  password: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}
