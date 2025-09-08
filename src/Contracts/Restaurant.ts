export interface Restaurant {
  id?: number;
  user_id: number;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  site?: string;
  description?: string;
  active?: boolean;
  show_price?: boolean;
  favorites_count?: number;
  rating_count?: number;
  stars_rating?: number;
  img?: string;
  created_at?: string;
  updated_at?: string;
}
