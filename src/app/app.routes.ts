import { Routes } from '@angular/router';
import { Cv } from './components/cv/cv';
import { Layout } from './components/layout/layout';
import { List } from './components/pokemon/list/list';
import { Detail } from './components/pokemon/detail/detail';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { authGuard } from './components/guard/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
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
