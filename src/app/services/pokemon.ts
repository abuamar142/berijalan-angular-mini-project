import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Pokemon {
  url: string = 'https://pokeapi.co/api/v2/';

  constructor(private readonly http: HttpClient) {}

  async getPokemonList(limit: number = 10, offset: number = 0) {
    try {
      const response = await firstValueFrom(
        this.http.get<{
          results: { name: string; url: string; types: string[] }[];
          count: number;
          next: string | null;
          previous: string | null;
        }>(`${this.url}pokemon?limit=${limit}&offset=${offset}`)
      );

      for (const pokemon of response.results) {
        const details = await this.getPokemonDetails(pokemon.url);
        pokemon.types = details.types.map((typeInfo) => typeInfo.type.name);
      }

      return response;
    } catch (error) {
      console.error('Error fetching Pokémon list:', error);
      throw error;
    }
  }

  async getPokemonDetails(url: string) {
    try {
      const response = await firstValueFrom(
        this.http.get<{
          id: number;
          name: string;
          types: { type: { name: string; url: string } }[];
          sprites: { other: { 'official-artwork': { front_default: string } } };
          height: number;
          weight: number;
          base_experience: number;
          order: number;
        }>(url)
      );
      return response;
    } catch (error) {
      console.error('Error fetching Pokémon details:', error);
      throw error;
    }
  }

  async getPokemonTypes() {
    const url = 'https://pokeapi.co/api/v2/type?limit=21';
    try {
      const response = await firstValueFrom(this.http.get<{ results: { name: string }[] }>(url));
      return response.results;
    } catch (error) {
      console.error('Error fetching Pokémon types:', error);
      throw error;
    }
  }

  async getPokemonSpecies(id: string) {
    try {
      const response = await firstValueFrom(
        this.http.get<{
          id: number;
          name: string;
          evolution_chain: { url: string };
        }>(`${this.url}pokemon-species/${id}`)
      );
      return response;
    } catch (error) {
      console.error('Error fetching Pokémon species:', error);
      throw error;
    }
  }

  async getEvolutionChain(url: string) {
    try {
      const response = await firstValueFrom(
        this.http.get<{
          chain: any;
        }>(url)
      );
      return response;
    } catch (error) {
      console.error('Error fetching evolution chain:', error);
      throw error;
    }
  }
}
