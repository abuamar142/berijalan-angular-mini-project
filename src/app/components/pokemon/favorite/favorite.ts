import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../card/card';
import { FavoriteService } from '../../../services/favorite';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [CommonModule, Card],
  templateUrl: './favorite.html',
  styleUrl: './favorite.scss',
})
export class Favorite implements OnInit {
  private favoriteService = inject(FavoriteService);
  private router = inject(Router);

  favorites = this.favoriteService.favorites;

  ngOnInit() {
    // Favorites sudah di-load dari localStorage oleh service
  }

  goToList() {
    this.router.navigate(['/pokemon']);
  }
}
