import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IMenu } from '../../utils/interface';
import { AuthService } from '../../services/auth';
import { FavoriteService } from '../../services/favorite';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  readonly auth = inject(AuthService);
  readonly favoriteService = inject(FavoriteService);
  private readonly router = inject(Router);

  menus: IMenu[] = [
    { name: 'CV', path: '/' },
    { name: 'Pokemon', path: '/pokemon', needAuth: true },
    { name: 'Favorites', path: '/pokemon/favorites', needAuth: true },
  ];

  async logout() {
    await this.auth.logout();
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
