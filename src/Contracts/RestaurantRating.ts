export interface RestaurantRating {
  id: number;
  restaurantId: number;
  clientId: number | null;
  stars: number;
  comment?: string | null;
  createdAt: string;
}

export interface RestaurantWithLocation {
  id: bigint;
  name: string;
  description?: string | null;
  img?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  site?: string | null;
  starsRating?: number | null;
  active?: boolean | null;
  // Dados de localização
  locationId?: bigint | null;
  cep?: string | null;
  uf?: string | null;
  city?: string | null;
  neighborhood?: string | null;
  street?: string | null;
  number?: string | null;
  mapLat?: string | null;
  mapLng?: string | null;
}
