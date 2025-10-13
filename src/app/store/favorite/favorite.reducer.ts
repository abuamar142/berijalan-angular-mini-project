import { createReducer, on } from '@ngrx/store';
import { initialFavoriteState } from './favorite.state';
import * as FavoriteActions from './favorite.actions';

export const favoriteReducer = createReducer(
  initialFavoriteState,

  on(FavoriteActions.addToFavorites, (state, { pokemon }) => {
    const existingItem = state.items.find((item) => item.id === pokemon.id);

    if (existingItem) {
      const updatedItems = state.items.map((item) =>
        item.id === pokemon.id ? { ...item, quantity: item.quantity + 1 } : item
      );

      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems + 1,
      };
    } else {
      const newItem = { ...pokemon, quantity: 1, addedAt: Date.now() };
      return {
        ...state,
        items: [...state.items, newItem],
        totalItems: state.totalItems + 1,
      };
    }
  }),

  on(FavoriteActions.removeFromFavorites, (state, { id }) => {
    const existingItem = state.items.find((item) => item.id === id);

    if (!existingItem) {
      return state;
    }

    return {
      ...state,
      items: state.items.filter((item) => item.id !== id),
      totalItems: state.totalItems - existingItem.quantity,
    };
  }),

  on(FavoriteActions.updateFavoriteQuantity, (state, { id, quantity }) => {
    if (quantity <= 0) {
      const pokemonToRemove = state.items.find((item) => item.id === id);

      if (!pokemonToRemove) {
        return state;
      }

      return {
        ...state,
        items: state.items.filter((item) => item.id !== id),
        totalItems: state.totalItems - pokemonToRemove.quantity,
      };
    }

    const existingItem = state.items.find((item) => item.id === id);

    if (!existingItem) {
      return state;
    }

    const quantityDifference = quantity - existingItem.quantity;

    const updatedItems = state.items.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );

    return {
      ...state,
      items: updatedItems,
      totalItems: state.totalItems + quantityDifference,
    };
  }),

  on(FavoriteActions.clearFavorites, () => initialFavoriteState)
);
