import { inject, Injectable } from '@angular/core';
import {
  CartItem,
  CartCartItemIdBody,
  UserIdCartBody,
  CartItemsService as SwaggerCartItemsService,
} from '../../generated';
import {map, Observable, of, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartItemsService {

  constructor(private cartItemsService: SwaggerCartItemsService) {}

  // Retrieve all items in a user's cart
  getCartItems(userId: number): Observable<CartItem[]> {
    return this.cartItemsService.apiUsersUserIdCartGet(userId).pipe(
      map((response: CartItem[]) => response),
      catchError((error) => {
        console.error(`Failed to fetch items for user with ID ${userId}:`, error);
        return of([]); // Return an empty array if the request fails for the cart management
      })
    );
  }

  // Add a new item to the user's cart
  addCartItem(userId: number, productId: number, quantity: number, size: string): Observable<CartItem> {
    const body: UserIdCartBody = {
      productId: productId,
      quantity: quantity,
      size: size,
    };

    return this.cartItemsService.apiUsersUserIdCartPost(body, userId).pipe(
      map((response: CartItem) => response),
      catchError((error) => {
        console.error(`Failed to add item to the cart for user with ID ${userId}:`, error);
        return throwError(() =>
          new Error(`Failed to add item to the cart for user with ID ${userId}.`)
        );
      })
    );
  }

  // Update the quantity of an item in the cart
  updateCartItemQuantity(userId: number, cartItemId: number, quantity: number): Observable<any> {
    const body: CartCartItemIdBody = {
      quantity: quantity,
    };

    return this.cartItemsService.apiUsersUserIdCartCartItemIdPut(body, userId, cartItemId).pipe(
      map((response) => response),
      catchError((error) => {
        console.error(`Failed to update cart item with ID ${cartItemId} for user with ID ${userId}:`, error);
        return throwError(() =>
          new Error(`Failed to update cart item with ID ${cartItemId} for user with ID ${userId}.`)
        );
      })
    );
  }

  // Remove an item from the user's cart
  removeCartItem(userId: number, cartItemId: number): Observable<void> {
    return this.cartItemsService.apiUsersUserIdCartCartItemIdDelete(userId, cartItemId).pipe(
      map(() => undefined),
      catchError((error) => {
        console.error(`Failed to remove cart item with ID ${cartItemId} for user with ID ${userId}:`, error);
        return throwError(() =>
          new Error(`Failed to remove cart item with ID ${cartItemId} for user with ID ${userId}.`)
        );
      })
    );
  }

  // Clear all items from the user's cart
  clearCart(userId: number): Observable<void> {
    return this.cartItemsService.apiUsersUserIdCartDelete(userId).pipe(
      map(() => undefined),
      catchError((error) => {
        console.error(`Failed to clear cart for user with ID ${userId}:`, error);
        return throwError(() =>
          new Error(`Failed to clear cart for user with ID ${userId}.`)
        );
      })
    );
  }
}
