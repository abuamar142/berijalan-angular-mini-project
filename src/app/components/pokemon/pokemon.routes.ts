import { Routes } from '@angular/router';
import { List } from './list/list';
import { Detail } from './detail/detail';
import { Favorite } from './favorite/favorite';

export const pokemonRoutes: Routes = [
  {
    path: '',
    component: List,
  },
  {
    path: 'favorites',
    component: Favorite,
  },
  {
    path: ':id',
    component: Detail,
  },
];
