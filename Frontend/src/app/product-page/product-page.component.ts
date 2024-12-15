import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../generated';
import {NgIf} from '@angular/common';
import {NavBarComponent} from '../nav-bar/nav-bar.component';
import {FormsModule} from '@angular/forms';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  standalone: true,
  imports: [
    NgIf,
    NavBarComponent,
    FormsModule
  ],
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  product: any;
  quantity: any;

  constructor(private route: ActivatedRoute, private productService: ProductsService, private cartService: CartService) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this.productService.apiProductsIdGet(productId).subscribe((data) => {
      this.product = data;
    });
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
    }
  }
}
