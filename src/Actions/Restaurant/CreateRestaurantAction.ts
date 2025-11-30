import { createClient } from "@/lib/supabase/client";
import { Restaurant } from "@/Contracts/Restaurant";
import { CreateRestaurantRestrictionAction } from "@/Actions/RestaurantRestriction/CreateRestaurantRestrictionAction";
import { CreateRestaurantLocationAction } from "@/Actions/RestaurantLocation/CreateRestaurantLocationAction";

export class CreateRestaurantAction {
  static async execute(payload: any) {
    console.log("CreateRestaurantAction - payload recebido:", payload);

    const supabase = createClient();
    // Extrai restrições e endereço do payload
    const { restrictions, cep, uf, city, district, street, number, ...rest } =
      payload;

    console.log("CreateRestaurantAction - dados do restaurante (rest):", rest);
    console.log("CreateRestaurantAction - img no rest:", rest.img);

    // Cria restaurante
    const { data, error } = await supabase
      .from("restaurants")
      .insert([rest])
      .select();

    console.log("CreateRestaurantAction - resultado insert:", { data, error });
    if (error) throw error;
    const restaurant = Array.isArray(data) ? data[0] : data;
    // Cria endereço
    await CreateRestaurantLocationAction.execute({
      restaurant_id: restaurant.id,
      cep,
      uf,
      city,
      neighborhood: district,
      street,
      number,
    });
    // Cria vínculos de restrições
    if (Array.isArray(restrictions) && restrictions.length > 0) {
      await CreateRestaurantRestrictionAction.execute(
        restaurant.id,
        restrictions
      );
    }
    return restaurant;
  }
}
