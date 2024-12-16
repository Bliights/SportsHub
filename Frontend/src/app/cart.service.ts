import { inject, Injectable } from '@angular/core';
import { ProductDTO } from './products.service';
import { HttpClient } from '@angular/common/http';
import { CartItemsService } from '../generated';
import { catchError } from 'rxjs/operators';
import {map, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly cartItemsService = inject(CartItemsService);

  constructor() {
  }

  getUserCart(userId: number): Observable<any> {
    return this.cartItemsService
      .apiUsersUserIdCartGet(userId)
      .pipe(
        catchError((error) => {
          console.error('Failed to fetch user cart:', error);
          return throwError(() => new Error('Failed to fetch user cart.'));
        })
      );
  }

  addToCart(userId: number, productId: number, quantity: number = 1, size: string = ''): void {
    this.getUserCart(userId).subscribe({
      next: (cartItems: any[]) => {
        // Chercher si un élément correspondant existe déjà dans le panier
        console.log("entry",productId, size)
        const existingItem = cartItems.find(item => item.productId === productId && item.size === size);
        console.log(existingItem)
        if (existingItem) {
          // Mettre à jour la quantité
          const updatedQuantity = existingItem.quantity + quantity;
          this.cartItemsService.apiUsersUserIdCartProductIdPut(
            { quantity: updatedQuantity, size },
            userId,
            productId
          ).subscribe({
            next: () => console.log('Item quantity updated successfully'),
            error: (err) => console.error('Failed to update item quantity', err),
          });
        } else {
          // Ajouter un nouvel élément au panier
          this.cartItemsService.apiUsersUserIdCartPost(
            { productId, quantity, size },
            userId
          ).subscribe({
            next: () => console.log('Item added to cart successfully'),
            error: (err) => console.error('Failed to add item to cart', err),
          });
        }
      },
      error: (err) => console.error('Failed to fetch user cart', err),
    });
  }

  clearUserCart(userId: number): void {
    this.getUserCart(userId).subscribe({
      next: (cartItems: any[]) => {
        const deleteRequests = cartItems.map(item =>
          this.cartItemsService.apiUsersUserIdCartProductIdDelete(userId, item.productId).toPromise()
        );

        Promise.all(deleteRequests)
          .then(() => {
            console.log('Cart cleared successfully.');
          })
          .catch(error => {
            console.error('Failed to clear the cart:', error);
          });
      },
      error: (error) => {
        console.error('Failed to fetch user cart:', error);
      }
    });
  }
}

export interface StockDTO {
  id: number;
  productId: number;
  quantity: number;
  size: string;
}

export class StockModel {
  public id!: number;
  public productId!: number;
  public quantity!: number;
  public size!: string;
  constructor(src: StockDTO) {
    this.id = src.id || -1;
    this.productId = src.productId || -1;
    this.quantity = src.quantity || 0;
    this.size = src.size || '';
  }
}
