import { inject, Injectable, signal } from '@angular/core';
import { FavoritePokemon } from '../utils/interface';
import { Pokemon } from './pokemon';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private readonly FAVORITES_KEY = 'pokemon_favorites';

  pokemonService = inject(Pokemon);

  // Signal untuk reactive updates
  favorites = signal<FavoritePokemon[]>([]);

  constructor() {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    if (this.isLocalStorageAvailable()) {
      const saved = localStorage.getItem(this.FAVORITES_KEY);
      if (saved) {
        try {
          const favorites = JSON.parse(saved);
          this.favorites.set(favorites);
        } catch (error) {
          console.error('Error loading favorites:', error);
          this.favorites.set([]);
        }
      }
    }
  }

  private saveFavorites(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(this.favorites()));
    }
  }

  private isLocalStorageAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && window.localStorage != null;
    } catch (error) {
      return false;
    }
  }

  addToFavorites(pokemon: any): void {
    const currentFavorites = this.favorites();

    // Check if already in favorites
    if (this.isFavorite(pokemon.id)) {
      return;
    }

    const favoritePokemon: FavoritePokemon = {
      id: pokemon.id,
      name: pokemon.name,
      url: pokemon.url,
      types: pokemon.types || [],
      imageUrl: this.pokemonService.getPokemonImageUrl(pokemon.url),
      addedAt: new Date().toISOString(),
    };

    const updatedFavorites = [...currentFavorites, favoritePokemon];
    this.favorites.set(updatedFavorites);
    this.saveFavorites();
  }

  removeFromFavorites(pokemonId: number): void {
    const currentFavorites = this.favorites();
    const updatedFavorites = currentFavorites.filter((fav) => fav.id !== pokemonId);
    this.favorites.set(updatedFavorites);
    this.saveFavorites();
  }

  isFavorite(pokemonId: number): boolean {
    return this.favorites().some((fav) => fav.id === pokemonId);
  }

  getFavoriteCount(): number {
    return this.favorites().length;
  }

  clearAllFavorites(): void {
    this.favorites.set([]);
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.FAVORITES_KEY);
    }
  }

  toggleFavorite(pokemon: any): void {
    if (this.isFavorite(pokemon.id)) {
      this.removeFromFavorites(pokemon.id);
    } else {
      this.addToFavorites(pokemon);
    }
  }
}
