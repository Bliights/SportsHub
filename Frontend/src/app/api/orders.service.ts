import {inject, Injectable} from '@angular/core';
import {Order, OrdersIdBody, OrdersService as SwaggerOrdersService, Product,} from '../../generated';
import {map, Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private ordersService: SwaggerOrdersService ) {}

  // Retrieve all orders
  getOrders(): Observable<Order[]> {
    return this.ordersService.apiOrdersGet().pipe(
      map((response: Order[]) => response),
      catchError((error) => {
        console.error('Failed to fetch orders:', error);
        return throwError(() => new Error('Failed to fetch orders.'));
      })
    );
  }

  // Retrieve details of a specific order
  getOrderById(orderId: number): Observable<Order> {
    return this.ordersService.apiOrdersIdGet(orderId).pipe(
      map((response: Order) => response),
      catchError((error) => {
        console.error(`Failed to fetch order with ID ${orderId}:`, error);
        return throwError(() => new Error(`Failed to fetch order with ID ${orderId}.`));
      })
    );
  }

  // Create a new order
  createOrder(userId: number): Observable<Order> {
    return this.ordersService.apiUsersUserIdOrdersPost(userId).pipe(
      map((response: Order) => response),
      catchError((error) => {
        console.error(`Failed to create order for user ID ${userId}:`, error);
        return throwError(() => new Error('Failed to create order.'));
      })
    );
  }

  // Fetch all orders of a specific user
  getOrdersByUserId(userId: number): Observable<Order[]> {
    return this.ordersService.apiUsersUserIdOrdersGet(userId).pipe(
      map((response: Order[]) => response),
      catchError((error) => {
        console.error(`Failed to fetch orders for user ID ${userId}:`, error);
        return throwError(() => new Error(`Failed to fetch orders for user ID ${userId}.`));
      })
    );
  }

  // Update a specific order
  updateOrder(orderId: number, status: string): Observable<Order> {
    const order: OrdersIdBody = { status: status, };

    return this.ordersService.apiOrdersIdPut(order, orderId).pipe(
      map((response: Order) => response),
      catchError((error) => {
        console.error(`Failed to update order with ID ${orderId}:`, error);
        return throwError(() => new Error('Failed to update order.'));
      })
    );
  }

}
