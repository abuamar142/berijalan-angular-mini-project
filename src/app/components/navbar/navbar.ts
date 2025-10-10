import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IMenu } from '../../utils/interface';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private readonly auth = inject(AuthService);

  menus: IMenu[] = [
    { name: 'CV', path: '/cv' },
    { name: 'Pokemon', path: '/pokemon' },
    { name: 'Login', path: '/login' },
  ];

  async logout() {
    await this.auth.logout();
  }
}
