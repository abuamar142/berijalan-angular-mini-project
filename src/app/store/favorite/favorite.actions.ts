import { createAction, props } from '@ngrx/store';
import { FavoritePokemon } from './favorite.state';

export const addToFavorites = createAction(
  '[Favorite] Add to Favorites',
  props<{ pokemon: Omit<FavoritePokemon, 'quantity' | 'addedAt'> }>()
);

export const removeFromFavorites = createAction(
  '[Favorite] Remove from Favorites',
  props<{ id: number }>()
);

export const updateFavoriteQuantity = createAction(
  '[Favorite] Update Favorite Quantity',
  props<{ id: number; quantity: number }>()
);

export const clearFavorites = createAction('[Favorite] Clear Favorites');
