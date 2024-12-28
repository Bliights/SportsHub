import { inject, Injectable } from '@angular/core';
import { OrdersItemsService as SwaggerOrdersItemsService } from '../../generated';
import { map, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OrderItem } from '../../generated';

@Injectable({
  providedIn: 'root'
})
export class OrdersItemsService {

  constructor(private ordersItemsService: SwaggerOrdersItemsService) {}

  // Retrieve all items in a specific order
  getOrderItems(orderId: number): Observable<OrderItem []> {
    return this.ordersItemsService.apiOrdersOrderIdItemsGet(orderId).pipe(
      map((response: OrderItem []) => response),
      catchError((error) => {
        console.error(`Failed to fetch items for order with ID ${orderId}:`, error);
        return throwError(() =>
          new Error(`Failed to fetch items for order with ID ${orderId}.`)
        );
      })
    );
  }
}
