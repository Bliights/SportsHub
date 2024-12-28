import { Component } from '@angular/core';
import {NavBarComponent} from '../nav-bar/nav-bar.component';
import {SearchBarComponent} from '../search-bar/search-bar.component';
import {ProductAreaComponent} from '../product-area/product-area.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    NavBarComponent,
    SearchBarComponent,
    ProductAreaComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
