import {Component, Input} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import {ProductDTO, ProductModel} from '../products.service';

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
  @Input() product: ProductDTO=new ProductModel({id: -1, name: '', description: '', price: 0, category: '', brand: '', imageUrl: ''});
  constructor(private authService: AuthService, private router: Router, private cartService: CartService) {
  }
  viewProductDetails() {
    this.router.navigate(['/product', this.product.id]);
  }
}
