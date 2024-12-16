import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../generated';
import {NgForOf, NgIf} from '@angular/common';
import {NavBarComponent} from '../nav-bar/nav-bar.component';
import {FormsModule} from '@angular/forms';
import { CartService } from '../cart.service';
import { StocksService } from '../../generated';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  standalone: true,
  imports: [
    NgIf,
    NavBarComponent,
    FormsModule,
    NgForOf
  ],
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  product: any;
  quantity: any;
  availableSizes: { size: string; quantity: number }[] = [];
  selectedSize: string | null = null;

  constructor(private route: ActivatedRoute, private productService: ProductsService, private cartService: CartService,private stocksService: StocksService,) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.apiProductsIdGet(productId).subscribe((data) => {
      this.product = data;
      this.loadStockBySize(productId);
      });
    }
  }

  loadStockBySize(productId: string): void {
    this.stocksService.apiProductsProductIdStockGet(productId).subscribe((stockData) => {
      this.availableSizes = stockData.map((stock: any) => ({
        size: stock.size,
        quantity: stock.quantity
      }));
      if (this.availableSizes.length > 0) {
        this.selectedSize = this.availableSizes[0].size;
      }
    });
  }

  getStockForSelectedSize(): number {
    const selectedStock = this.availableSizes.find((q) => q.size === this.selectedSize);
    return selectedStock ? selectedStock.quantity : 0;
  }

  onSizeChange(): void {
    this.quantity = 1;
  }

  validateQuantity(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = parseInt(inputElement.value, 10);
    const maxQuantity = this.getStockForSelectedSize();

    if (isNaN(inputValue) || inputValue < 1) {
      this.quantity = 1;
    }
    else if (this.quantity > maxQuantity) {
      this.quantity = maxQuantity;
    }
    else if (this.quantity < 1) {
      this.quantity = 1;
    }

    inputElement.value = this.quantity.toString();
  }

  addToCart(): void {
    if (this.product && this.selectedSize) {
      this.cartService.addToCart(this.product, this.quantity,  this.selectedSize);
    }
  }


}
