import { Component,inject } from '@angular/core';
import {ProductItemComponent} from '../product-item/product-item.component';
import {ProductDTO, ProductsService} from '../products.service';
import {NgForOf} from '@angular/common';
@Component({
  selector: 'app-product-area',
  standalone: true,
  imports: [
    ProductItemComponent,
    NgForOf
  ],
  templateUrl: './product-area.component.html',
  styleUrl: './product-area.component.css'
})
export class ProductAreaComponent {
  private readonly productService = inject(ProductsService);

  products: ProductDTO[] = [];

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        console.log('finished loaded Products, saving to component field');
        this.products = data;
      },
      error: (err) => {
        console.error('error loading products', err);
      }
    });
  }
}
