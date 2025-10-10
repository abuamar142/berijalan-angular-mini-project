import { Routes } from '@angular/router';
import { List } from './list/list';
import { Detail } from './detail/detail';

export const pokemonRoutes: Routes = [
  {
    path: '',
    component: List,
  },
  {
    path: ':id',
    component: Detail,
  },
];
