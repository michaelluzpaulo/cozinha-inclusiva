export interface User {
  id?: number;
  name: string;
  active?: boolean;
  email: string;
  password: string;
  role_id: number;
  created_at?: string;
  updated_at?: string;
}
