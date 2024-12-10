import { HttpClient } from '@angular/common/http';
import {inject, Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { Router } from '@angular/router';
import { ProductDTO } from './products.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly httpClient = inject(HttpClient);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  orderItems(userId: number, cartItems: ProductDTO[], total: number) {
    const orderPayload = { totalPrice: total };

    // Step 1: Create an order
    this.httpClient.post(`/api/users/${userId}/orders`, orderPayload).subscribe({
      next: () => {
        // Step 2: Retrieve the order ID
        this.httpClient.get<OrderDTO[]>(`/api/users/${userId}/orders`).subscribe({
          next: (orders: OrderDTO[]) => {
            const latestOrder = orders.reduce((prev, current) => (prev.createdAt > current.createdAt) ? prev : current);
            const orderId = latestOrder.id;

            // Step 3: Create order items
            const orderItemsPayload = cartItems.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              size: 'M',
              price: item.price
            }));

            orderItemsPayload.forEach(orderItem => {
              this.httpClient.post(`/api/orders/${orderId}/items`, orderItem).subscribe({
                next: () => {
                  console.log('Order item created successfully');
                },
                error: (error) => {
                  console.error('Failed to create order item:', error);
                }
              });
            });

            // Optionally, clear the cart after ordering
            this.cartService.cart = [];
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error('Failed to retrieve orders:', error);
          }
        });
      },
      error: (error) => {
        console.error('Failed to create order:', error);
      }
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
