import { Component, signal, OnInit, Input } from '@angular/core';
import { Pokemon } from '../../../services/pokemon';
import { Card } from '../card/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IPokemon } from '../../../utils/interface';
import { Button } from '../../button/button';

@Component({
  selector: 'app-list',
  imports: [CommonModule, Card, FormsModule, Button],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List implements OnInit {
  allPokemons = signal<IPokemon[]>([]);
  currentPagePokemons = signal<IPokemon[]>([]);
  filteredPokemons = signal<IPokemon[]>([]);
  pokemonTypes = signal<any[]>([]);

  loading = signal<boolean>(false);
  randomPokemon = signal<IPokemon | null>(null);
  showRandomOnly = signal<boolean>(false);

  // Pagination properties
  currentPage = signal<number>(1);
  itemsPerPage = 8;
  totalCount = signal<number>(0);
  hasNext = signal<boolean>(false);
  hasPrevious = signal<boolean>(false);

  // Cache untuk menyimpan data Pokemon per page
  private pokemonCache = new Map<number, IPokemon[]>();
  private maxLoadedPage = 0;

  constructor(private pokemonService: Pokemon, private router: Router) {}

  async ngOnInit() {
    await this.fetchPokemons();
    await this.fetchPokemonTypes();
  }

  async fetchPokemonTypes() {
    try {
      const types = await this.pokemonService.getPokemonTypes();
      this.pokemonTypes.set(types);
    } catch (error) {
      console.error('Error fetching Pokemon types:', error);
    }
  }

  async fetchPokemons(page: number = 1) {
    try {
      this.loading.set(true);

      // Check if we already have this page cached
      if (this.pokemonCache.has(page)) {
        const cachedPokemons = this.pokemonCache.get(page)!;
        this.currentPagePokemons.set(cachedPokemons);
        this.currentPage.set(page);
        this.updatePaginationInfo(page);
        this.updateFilteredList();
        this.loading.set(false);
        return;
      }

      const offset = (page - 1) * this.itemsPerPage;
      const response = await this.pokemonService.getPokemonList(this.itemsPerPage, offset);

      // Cache the fetched Pokemon for this page
      this.pokemonCache.set(page, response.results);
      this.currentPagePokemons.set(response.results);

      // Update max loaded page
      if (page > this.maxLoadedPage) {
        this.maxLoadedPage = page;
      }

      // Rebuild allPokemons from cache in order
      this.rebuildAllPokemonsFromCache();

      // Update pagination info
      this.totalCount.set(response.count);
      this.hasNext.set(response.next !== null);
      this.hasPrevious.set(response.previous !== null);
      this.currentPage.set(page);

      // Update filtered list based on current search
      this.updateFilteredList();
    } catch (error) {
      console.error('Error fetching Pokémon list:', error);
    } finally {
      this.loading.set(false);
    }
  }

  private updatePaginationInfo(page: number) {
    const total = this.totalCount();
    this.hasPrevious.set(page > 1);
    this.hasNext.set(page < Math.ceil(total / this.itemsPerPage));
  }

  private rebuildAllPokemonsFromCache() {
    const allPokemons: IPokemon[] = [];

    const sortedPages = Array.from(this.pokemonCache.keys()).sort((a, b) => a - b);

    for (const pageNum of sortedPages) {
      const pagePokemons = this.pokemonCache.get(pageNum)!;
      allPokemons.push(...pagePokemons);
    }

    this.allPokemons.set(allPokemons);
  }

  async nextPage() {
    if (this.hasNext()) {
      await this.fetchPokemons(this.currentPage() + 1);
    }
  }

  async previousPage() {
    if (this.hasPrevious()) {
      await this.fetchPokemons(this.currentPage() - 1);
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.totalCount() / this.itemsPerPage);
  }

  updateFilteredList() {
    const term = this.searchTerm.toLowerCase();
    const typeFilter = this.selectedType;

    let pokemonsToFilter: IPokemon[];

    if (term !== '' || typeFilter !== 'all') {
      pokemonsToFilter = this.allPokemons();
    } else {
      pokemonsToFilter = this.currentPagePokemons();
    }

    let filtered = pokemonsToFilter;

    // Apply name filter
    if (term !== '') {
      filtered = filtered.filter((pokemon) => pokemon.name.toLowerCase().includes(term));
    }

    // Apply type filter
    if (typeFilter !== '' && typeFilter !== 'all') {
      filtered = filtered.filter((pokemon) => pokemon.types && pokemon.types.includes(typeFilter));
    }

    this.filteredPokemons.set(filtered);
  }

  searchTerm: string = '';
  selectedType: string = 'all';

  async onSearch() {
    if (this.searchTerm !== '') {
      await this.ensureEnoughDataForSearch();
    }
    this.updateFilteredList();
  }

  async onTypeFilter() {
    if (this.selectedType !== 'all') {
      await this.ensureEnoughDataForSearch();
    }
    this.updateFilteredList();
  }

  private async ensureEnoughDataForSearch() {
    const totalPages = Math.ceil(this.totalCount() / this.itemsPerPage);
    const pagesToLoad = Math.min(totalPages, 10);

    if (this.maxLoadedPage < pagesToLoad) {
      this.loading.set(true);
      try {
        // Load pages we haven't loaded yet
        for (let page = this.maxLoadedPage + 1; page <= pagesToLoad; page++) {
          if (!this.pokemonCache.has(page)) {
            const offset = (page - 1) * this.itemsPerPage;
            const response = await this.pokemonService.getPokemonList(this.itemsPerPage, offset);
            this.pokemonCache.set(page, response.results);
            this.maxLoadedPage = page;
          }
        }

        this.rebuildAllPokemonsFromCache();
      } catch (error) {
        console.error('Error loading additional Pokemon data:', error);
      } finally {
        this.loading.set(false);
      }
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.selectedType = 'all';
    this.updatePaginationInfo(this.currentPage());
    this.updateFilteredList();
  }

  // Get type-specific colors for the dropdown
  getTypeColors(type: string): { bg: string; text: string } {
    const typeColors: { [key: string]: { bg: string; text: string } } = {
      all: { bg: 'bg-gray-500', text: 'text-white' },
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
    };

    return typeColors[type] || typeColors['all'];
  }

  onPokemonSelected(pokemonUrl: string) {
    const id = this.pokemonService.getPokemonId(pokemonUrl);
    this.router.navigate(['/pokemon', id]);
  }

  async showRandomPokemon() {
    try {
      this.loading.set(true);

      // Generate random ID between 1 and 1025 (total Pokemon in API)
      const randomId = Math.floor(Math.random() * 1025) + 1;

      // Fetch random Pokemon details
      const pokemonUrl = this.pokemonService.getPokemonUrl(randomId.toString());
      const randomPokemonData = await this.pokemonService.getPokemonDetails(pokemonUrl);

      // Transform to match our Pokemon interface
      const randomPokemon: IPokemon = {
        name: randomPokemonData.name,
        url: pokemonUrl,
        types: randomPokemonData.types.map((t: any) => t.type.name),
      };

      this.randomPokemon.set(randomPokemon);
      this.showRandomOnly.set(true);

      // Clear search filters when showing random
      this.searchTerm = '';
      this.selectedType = 'all';
    } catch (error) {
      console.error('Error fetching random Pokemon:', error);
      alert('Failed to fetch random Pokemon. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  backToNormalView() {
    this.showRandomOnly.set(false);
    this.randomPokemon.set(null);
    this.updateFilteredList();
  }
}
