import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { IPokemon } from '../../../utils/interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FavoriteService } from '../../../services/favorite';
import { Pokemon } from '../../../services/pokemon';

@Component({
  selector: 'app-pokemon-card',
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  @Input() pokemonUrl: string = '';
  @Input() pokemonName: string = '';
  @Input() pokemonTypes: string[] = [];
  @Output() pokemonSelected = new EventEmitter<string>();

  private favoriteService = inject(FavoriteService);

  constructor(private router: Router) {}

  pokemonService = inject(Pokemon);

  // Get type-specific colors
  getTypeColors(type: string): { bg: string; text: string } {
    const typeColors: { [key: string]: { bg: string; text: string } } = {
      normal: { bg: 'bg-gray-400', text: 'text-white' },
      fire: { bg: 'bg-red-500', text: 'text-white' },
      water: { bg: 'bg-blue-500', text: 'text-white' },
      electric: { bg: 'bg-yellow-400', text: 'text-black' },
      grass: { bg: 'bg-green-500', text: 'text-white' },
      ice: { bg: 'bg-blue-200', text: 'text-blue-900' },
      fighting: { bg: 'bg-red-700', text: 'text-white' },
      poison: { bg: 'bg-purple-500', text: 'text-white' },
      ground: { bg: 'bg-yellow-600', text: 'text-white' },
      flying: { bg: 'bg-indigo-400', text: 'text-white' },
      psychic: { bg: 'bg-pink-500', text: 'text-white' },
      bug: { bg: 'bg-green-400', text: 'text-white' },
      rock: { bg: 'bg-yellow-800', text: 'text-white' },
      ghost: { bg: 'bg-purple-700', text: 'text-white' },
      dragon: { bg: 'bg-indigo-700', text: 'text-white' },
      dark: { bg: 'bg-gray-800', text: 'text-white' },
      steel: { bg: 'bg-gray-500', text: 'text-white' },
      fairy: { bg: 'bg-pink-300', text: 'text-pink-900' },
      unknown: { bg: 'bg-gray-300', text: 'text-gray-700' },
    };

    return typeColors[type] || typeColors['unknown'];
  }

  selectPokemon() {
    const id = this.pokemonService.getPokemonId(this.pokemonUrl);
    this.router.navigate(['/pokemon', id]);
  }

  toggleFavorite(event: Event) {
    event.stopPropagation(); // Prevent navigation when clicking favorite button

    const pokemon = {
      id: parseInt(this.pokemonService.getPokemonId(this.pokemonUrl)),
      name: this.pokemonName,
      url: this.pokemonUrl,
      types: this.pokemonTypes,
    };

    this.favoriteService.toggleFavorite(pokemon);
  }

  isFavorite(): boolean {
    const id = parseInt(this.pokemonService.getPokemonId(this.pokemonUrl));
    return this.favoriteService.isFavorite(id);
  }
}
