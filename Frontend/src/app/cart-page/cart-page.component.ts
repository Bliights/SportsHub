import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { ProductDTO } from '../products.service';
import { NgForOf, NgIf } from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import {OrderService} from '../order.service';
import {AuthService} from '../auth.service';

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

  constructor(private cartService: CartService,private orderService:OrderService, private authService: AuthService)
  {

  }

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
    this.orderService.orderItems(this.authService.idUser, this.cartItems, this.total);
  }
}
