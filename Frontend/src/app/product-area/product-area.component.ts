import { Component } from '@angular/core';
import {ProductItemComponent} from '../product-item/product-item.component';

@Component({
  selector: 'app-product-area',
  standalone: true,
  imports: [
    ProductItemComponent
  ],
  templateUrl: './product-area.component.html',
  styleUrl: './product-area.component.css'
})
export class ProductAreaComponent {

}
