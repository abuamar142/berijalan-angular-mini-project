export interface FavoritePokemon {
  id: number;
  name: string;
  image: string;
  element: string[];
  quantity: number;
  addedAt: number;
}

export interface FavoriteState {
  items: FavoritePokemon[];
  totalItems: number;
}

export const initialFavoriteState: FavoriteState = {
  items: [],
  totalItems: 0,
};
