import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { ProductDTO } from '../products.service';
import { NgForOf, NgIf } from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import {OrderService} from '../order.service';
import {AuthService} from '../auth.service';
import {ProductsService} from '../products.service';

export class CartItem {
  public id!: number;
  public userId!: number;
  public productId!: number;
  public quantity!: number;
  public size!: string;
  public createdAt!: Date;
  public price: number = 0; // Prix par produit
  public name: string = "";

  constructor(data: any) {
    this.id = data.id;
    this.userId = data.userId;
    this.productId = data.productId;
    this.quantity = data.quantity;
    this.size = data.size;
    this.createdAt = new Date(data.createdAt);
    this.name = data.name;
  }
}




@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NavBarComponent
  ],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  cartItems: any[] = [];
  total: number = 0;

  constructor(private cartService: CartService,
              private orderService:OrderService,
              private productsService: ProductsService,
              private authService: AuthService)
  {

  }

  ngOnInit(): void {
    this.loadCart();

  }
  loadCart(): void {
    const userId = this.authService.idUser;

    this.cartService.getUserCart(userId).subscribe({
      next: (data) => {
        // Mappage des données reçues vers des instances de CartItem
        this.cartItems = data.map((item: any) => {
          const cartItem = new CartItem(item);

          this.productsService.getProductPrice(item.productId).subscribe({
            next: (price) => {
              cartItem.price = price; // Met à jour le prix du produit
              this.calculateTotal(); // Recalculer le total après mise à jour
            },
            error: (err) => {
              console.error(`Failed to fetch price for product ${item.productId}`, err);
            },
          });

          this.productsService.getProductName(item.productId).subscribe({
            next: (name) => {
              cartItem.name = name;
            },
            error: (err) => {
              console.error(`Failed to fetch name for product ${item.productId}`, err);
            },
          });

          return cartItem;
        });

        console.log('Cart items loaded:', this.cartItems);
      },
      error: (err) => {
        console.error('Error loading cart:', err);
      },
    });
  }

  /**
   * Calculer le total du panier
   */
  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => {
      return sum + (item.price || 0) * (item.quantity || 1);
    }, 0);
    console.log('Total calculated:', this.total);
  }
  orderItems() {
    this.orderService.orderItems(this.authService.idUser, this.cartItems, this.total);
    this.cartService.clearUserCart(this.authService.idUser);
  }
}
