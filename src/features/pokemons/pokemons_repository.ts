import { Injectable } from '@nestjs/common';
import {
  POKE_FINDER_URL,
  AVAILABLE_IMAGES,
  PAGE_TOTAL,
  LIMIT,
  POKEMONS_ENDPOINT,
} from 'src/constants';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PokemonsRepository {
  constructor(private http: HttpService) {}

  async getPokemons(page: number): Promise<PokemonResponse> {
    try {
      const response = await this.http
        .get(
          `https://pokeapi.co/api/v2/pokemon?offset=${
            page * LIMIT
          }&limit=${LIMIT}`,
        )
        .toPromise();
      return this.addImageAndId(response.data, page);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  private addImageAndId(pokemons: any, page: number): PokemonResponse {
    const results: Pokemon[] = pokemons.results.map((pokemon, index) => {
      const pokemonResult = {};
      const id = index + 1 + page * LIMIT;
      pokemonResult['id'] = id;
      pokemonResult['name'] = pokemon.name;
      pokemonResult['imageUrl'] =
        id <= AVAILABLE_IMAGES
          ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
          : `https://upload.wikimedia.org/wikipedia/commons/b/b1/Pok%C3%A9ball.png`;

      return pokemonResult;
    });
    return {
      count: pokemons.count,
      next:
        page < PAGE_TOTAL
          ? `${POKE_FINDER_URL}${POKEMONS_ENDPOINT}?page=${+page + 1}`
          : null,
      previous:
        page > 0
          ? `${POKE_FINDER_URL}${POKEMONS_ENDPOINT}?page=${page - 1}`
          : null,
      results: results,
    };
  }
}

interface PokemonResponse {
  count: number;
  next: string;
  previous: string;
  results: Pokemon[];
}
interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
}
