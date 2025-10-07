import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, Navbar],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {

}
