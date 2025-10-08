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
    { name: 'CV', path: '/cv' },
    { name: 'Pokemon', path: '/pokemon' },
    { name: 'Counter', path: '/counter' },
    { name: 'My Pokemons', path: '/my-pokemons' },
  ];
}
