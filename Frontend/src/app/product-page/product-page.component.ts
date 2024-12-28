import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Product} from '../../generated';
import {ProductsService} from '../api/products.service';
import {StocksService} from '../api/stocks.service';
import {CartItemsService} from '../api/cart-items.service';
import { Stock } from '../../generated';
import {NavBarComponent} from '../nav-bar/nav-bar.component';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [
    NavBarComponent,
    NgIf,
    FormsModule,
    NgForOf
  ],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css'
})
export class ProductPageComponent implements OnInit {
  productId: number = -1;
  product: Product = {};
  stocks: Stock[] = [];
  size: string= '';
  quantity: number = 1;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private productsService: ProductsService,
              private stocksService: StocksService,
              private cartItemsService: CartItemsService,
              private authService: AuthService) {

  }

  ngOnInit(): void {
    this.loadProduct();
  }

  // Load product and stock details
  loadProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productId = id ? parseInt(id, 10) : -1;

    //load product details
    this.productsService.getProductById(this.productId).subscribe((product) => {
      this.product = product;
    });

    //load stock details
    this.stocksService.getStockForProduct(this.productId).subscribe((stocks) => {
      this.stocks = stocks.filter(stock => stock.quantity > 0);
      if (stocks.length > 0) {
        this.size = stocks[0].size;
      }
    });
  }

  // Get stock for selected size
  getStockForSelectedSize(): number {
    const stock = this.stocks.find((s) => s.size === this.size);
    return stock ? stock.quantity : 0;
  }

  // Quantity available for selected size
  validateQuantity(): void {
    const maxStock = this.getStockForSelectedSize();
    if (this.authService.isAuthenticated) {
      this.cartItemsService.getCartItems(this.authService.userId).subscribe(cartItems => {
        const cartItem = cartItems.find(item => item.productId === this.productId && item.size === this.size);
        const cartQuantity = cartItem ? cartItem.quantity : 0;
        const availableStock = maxStock - cartQuantity;

        if (this.quantity < 1) {
          this.quantity = 1;
        } else if (this.quantity > availableStock) {
          this.quantity = availableStock;
        }
      });
    } else {
      if (this.quantity < 1) {
        this.quantity = 1;
      } else if (this.quantity > maxStock) {
        this.quantity = maxStock;
      }
    }
  }

  // Navigate to home page
  goHome(): void {
    this.router.navigate(['/']);
  }

  // Add product to cart
  addToCart(): void {
    if (this.authService.isAuthenticated){
    const userId = this.authService.userId;
    this.cartItemsService.addCartItem(userId, this.productId, this.quantity, this.size).subscribe((item) => {
      console.log('Item successfully added to cart:', item);
      alert('Item successfully added to cart');
      this.router.navigate(['/']);
    });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
