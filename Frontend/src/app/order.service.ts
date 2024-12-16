import { HttpClient } from '@angular/common/http';
import {inject, Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { OrdersService } from '../generated';
import { OrdersItemsService } from '../generated';
import { Router } from '@angular/router';
import { ProductDTO } from './products.service';
import {CartItem} from './cart-page/cart-page.component';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly ordersService = inject(OrdersService);
  private readonly ordersItemsService = inject(OrdersItemsService);
  private readonly router = inject(Router);

  orderItems(userId: number, cartItems: CartItem[], total: number): void {
    // Étape 1 : Créer une commande
    this.ordersService.apiUsersUserIdOrdersPost({ totalPrice: total }, userId).subscribe({
      next: (orderResponse: any) => {
        const orderId = orderResponse.id;

        // Étape 2 : Créer les articles de la commande
        const orderItemsPayload = cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          size: item.size,
          price: item.price,
        }));

        const orderItemsRequests = orderItemsPayload.map((orderItem) =>
          this.ordersItemsService.apiOrdersOrderIdItemsPost(orderItem, orderId).toPromise()
        );

        // Attendre que tous les articles soient créés
        Promise.all(orderItemsRequests)
          .then(() => {
            console.log('Tous les articles de commande ont été créés avec succès.');

            // Optionnel : Vider le panier après la commande
            // this.cartService.clearCart();

            // Rediriger vers une page de confirmation ou d'accueil
            this.router.navigate(['/']);
          })
          .catch((error) => {
            console.error('Erreur lors de la création des articles de commande:', error);
          });
      },
      error: (error) => {
        console.error('Erreur lors de la création de la commande:', error);
      },
    });
  }
}

export interface OrderDTO {
  id: number;
  userId: number;
  status: "pending" | "shipped" | "delivered";
  totalPrice: number;
  createdAt: Date;
  closedAt: Date | null;
}
export class OrderModel{
  public id!: number;
  public userId!: number;
  public status!: "pending" | "shipped" | "delivered";
  public totalPrice!: number;
  public createdAt!: Date;
  public closedAt!: Date | null;
  constructor(src: OrderDTO) {
    this.id = src.id;
    this.userId = src.userId;
    this.status = src.status;
    this.totalPrice = src.totalPrice;
    this.createdAt = src.createdAt;
    this.closedAt = src.closedAt;
  }
}
export interface OrderItemDTO {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  size: string;
  price: number;
  createdAt: Date;
}

export class OrderItemModel {
  public id!: number;
  public orderId!: number;
  public productId!: number;
  public quantity!: number;
  public size!: string;
  public price!: number;
  public createdAt!: Date;
  constructor(src: OrderItemDTO) {
    this.id = src.id;
    this.orderId = src.orderId;
    this.productId = src.productId;
    this.quantity = src.quantity;
    this.size = src.size;
    this.price = src.price;
    this.createdAt = src.createdAt;
  }
}
