import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';

export const authRoutes: Routes = [
  {
    path: '',
    component: Login,
  },
];
