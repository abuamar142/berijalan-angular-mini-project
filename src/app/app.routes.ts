import { Routes } from '@angular/router';
import { Cv } from './components/cv/cv';
import { Layout } from './components/layout/layout';
import { List } from './components/pokemon/list/list';
import { Detail } from './components/pokemon/detail/detail';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: Cv },
      { path: 'cv', component: Cv },
      { path: 'pokemon', component: List },
      {
        path: 'pokemon/:id',
        component: Detail,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
