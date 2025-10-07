import { Component } from '@angular/core';

@Component({
  selector: 'app-counter',
  imports: [],
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
