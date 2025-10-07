import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IMenu } from '../../utils/interface';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  menus: IMenu[] = [
    { name: 'Pokemon List', path: '/pokemon-list' },
    { name: 'My Pokemons', path: '/my-pokemons' },
  ];
}
