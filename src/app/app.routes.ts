import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { authGuard } from './components/guard/auth.guard';
import { guestGuard } from './components/guard/guest.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    component: Register,
    canActivate: [guestGuard],
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        loadChildren: () => import('./components/cv/cv.routes').then((m) => m.cvRoutes),
      },
      {
        path: 'cv',
        loadChildren: () => import('./components/cv/cv.routes').then((m) => m.cvRoutes),
      },
    ],
  },
  {
    path: 'pokemon',
    component: Layout,
    canActivate: [authGuard],
    loadChildren: () => import('./components/pokemon/pokemon.routes').then((m) => m.pokemonRoutes),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
