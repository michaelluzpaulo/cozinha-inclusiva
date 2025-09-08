import { DeleteRestaurantRestrictionAction } from "./DeleteRestaurantRestrictionAction";
import { CreateRestaurantRestrictionAction } from "./CreateRestaurantRestrictionAction";

export class UpdateRestaurantRestrictionAction {
  static async execute(restaurant_id: number, restrictions: number[]) {
    await DeleteRestaurantRestrictionAction.execute(restaurant_id);
    await CreateRestaurantRestrictionAction.execute(
      restaurant_id,
      restrictions
    );
  }
}
