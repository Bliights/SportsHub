import { inject, Injectable } from '@angular/core';
import { ProductDTO } from './products.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cart: ProductDTO[] = [];
  private readonly httpClient = inject(HttpClient);

  constructor() {
    this.loadCartFromLocalStorage();
  }

  private loadCartFromLocalStorage() {
    const cartJson = localStorage.getItem('cart');
    if (cartJson) {
      this.cart = JSON.parse(cartJson);
    }
  }

  private saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }



  addToCart(product: ProductDTO, quantity: number = 1) {
    this.httpClient.get<StockDTO[]>(`/api/products/${product.id}/stock`).subscribe({
      next: (response: StockDTO[]) => {
        const isInStock = response[0].quantity >= quantity;
        console.log('response', response);
        console.log('response stock', response[0].quantity);
        console.log('isInStock', isInStock);

        if (isInStock) {
          const existingProduct = this.cart.find(item => item.id === product.id);
          if (existingProduct) {
            existingProduct.quantity! += quantity;
            alert(`Updated quantity for product: ${product.name}`);
          } else {
            this.cart.push({ ...product, quantity });
            alert(`Product added to cart: ${product.name}`);
          }
          this.saveCartToLocalStorage();
        } else {
          alert(`Product is out of stock: ${product.name}`);
        }
      },
      error: (error) => {
        console.error('Failed to check stock:', error);
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
