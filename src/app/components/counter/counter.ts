import { Component } from '@angular/core';
import { Button } from '../button/button';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [Button],
  templateUrl: './counter.html',
  styleUrl: './counter.scss',
})
export class Counter {
  count: number = 0;

  increment(value: number) {
    this.count += value;
  }

  reset() {
    this.count = 0;
  }
}
