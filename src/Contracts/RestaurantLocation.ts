export interface RestaurantLocation {
  id?: number;
  restaurant_id: number;
  cep?: string;
  uf?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  number?: string;
  map_lat?: string;
  map_lng?: string;
  created_at?: string;
  updated_at?: string;
}
