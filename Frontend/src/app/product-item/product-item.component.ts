import {Component, Input} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css'
})
export class ProductItemComponent {
  @Input() image: string = "";
  @Input() name?: string = "";
  @Input() price?: string = "0€";
  constructor() {
    console.log(this.image);
  }
}
