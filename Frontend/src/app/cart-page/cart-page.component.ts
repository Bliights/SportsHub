import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { ProductDTO } from '../products.service';
import { NgForOf, NgIf } from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

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
  cartItems: ProductDTO[] = [];
  total: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.cart;
    for (let item of this.cartItems) {
      if(item.quantity){
        this.total += item.price * item.quantity;
      }else{
        this.total += item.price;
      }
    }
  }

  orderItems() {
    
  }
}
