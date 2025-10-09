import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pokemon } from '../../../services/pokemon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail',
  imports: [CommonModule],
  templateUrl: './detail.html',
  styleUrl: './detail.scss',
})
export class Detail implements OnInit {
  pokemonId = signal<string>('');
  pokemonData = signal<any>(null);
  loading = signal<boolean>(false);
  error = signal<string>('');
  playingSound = signal<boolean>(false);
  evolutionChain = signal<any[]>([]);

  constructor(
    private router: ActivatedRoute,
    private pokemonService: Pokemon,
    private readonly routerr: Router
  ) {}

  async ngOnInit() {
    const id = this.router.params.subscribe(async (params) => {
      const pokemonId = params['id'];
      if (pokemonId) {
        this.pokemonId.set(pokemonId.toString());
        await this.fetchPokemonDetails();
      }
    });
  }

  async fetchPokemonDetails() {
    try {
      this.loading.set(true);
      this.error.set('');
      const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${this.pokemonId()}`;
      const details = await this.pokemonService.getPokemonDetails(pokemonUrl);
      this.pokemonData.set(details);

      // Fetch evolution chain
      await this.fetchEvolutionChain();
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
      this.error.set('Failed to load Pokemon details');
    } finally {
      this.loading.set(false);
    }
  }

  async fetchEvolutionChain() {
    try {
      this.loading.set(true);
      const species = await this.pokemonService.getPokemonSpecies(this.pokemonId());
      const evolutionData = await this.pokemonService.getEvolutionChain(
        species.evolution_chain.url
      );

      // Parse evolution chain
      const evolutions = this.parseEvolutionChain(evolutionData.chain);
      this.evolutionChain.set(evolutions);
    } catch (error) {
      console.error('Error fetching evolution chain:', error);
    } finally {
      this.loading.set(false);
    }
  }

  parseEvolutionChain(chain: any): any[] {
    const evolutions: any[] = [];

    const addEvolution = (evolution: any) => {
      const id = this.extractIdFromUrl(evolution.species.url);
      evolutions.push({
        id: id,
        name: evolution.species.name,
        url: evolution.species.url,
      });

      if (evolution.evolves_to && evolution.evolves_to.length > 0) {
        evolution.evolves_to.forEach((nextEvolution: any) => {
          addEvolution(nextEvolution);
        });
      }
    };

    addEvolution(chain);

    console.log('Parsed Evolutions:', evolutions);
    return evolutions;
  }

  extractIdFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2];
  }

  async selectEvolution(evolutionId: string) {
    this.pokemonId.set(evolutionId);
    await this.fetchPokemonDetails();

    // Update URL without page reload
    // window.history.pushState({}, '', `/pokemon/${evolutionId}`);
    this.routerr.navigate(['/pokemon', evolutionId]);
  }

  getPokemonImageUrl(id: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }

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

  playSound() {
    const audio = new Audio(this.pokemonData().cries.latest);
    if (!this.playingSound()) {
      this.playingSound.set(true);
      audio.play();
      audio.onended = () => {
        this.playingSound.set(false);
      };
    }
  }
}
