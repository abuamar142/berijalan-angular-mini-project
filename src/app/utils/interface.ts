export interface IMenu {
  name: string;
  path: string;
}

export interface IProfile {
  name: string;
  role: string;
  email: string;
  website: string;
  phone: string;
  location: string;
}

export interface ITodo {
  task: string;
  completed: boolean;
}

export interface IPokemon {
  name: string;
  url: string;
  types: string[];
  height: number;
  weight: number;
  base_experience: number;
  order: number;
}

export interface FavoritePokemon {
  id: number;
  name: string;
  url: string;
  types: string[];
  imageUrl: string;
  addedAt: string;
}
