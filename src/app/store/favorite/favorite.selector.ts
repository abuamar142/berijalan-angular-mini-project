import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoriteState } from './favorite.state';

export const selectFavoriteState = createFeatureSelector<FavoriteState>('favorite');

export const selectFavoriteItems = createSelector(selectFavoriteState, (state) => state.items);

export const selectTotalFavoriteItems = createSelector(
  selectFavoriteState,
  (state) => state.totalItems
);

export const selectPokemonById = (id: number) =>
  createSelector(selectFavoriteItems, (items) => items.find((item) => item.id === id));

export const selectPokemonTotal = createSelector(selectFavoriteItems, (items) =>
  items.reduce((total, item) => total + item.quantity, 0)
);

export const selectIsPokemonInFavorites = (id: number) =>
  createSelector(selectFavoriteItems, (items) => items.some((item) => item.id === id));
