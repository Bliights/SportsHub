import { inject, Injectable } from '@angular/core';
import { Stock, StocksService as SwaggerStocksService, ProductIdStockBody, StockSizeBody } from '../../generated';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StocksService {

  constructor(private stocksService: SwaggerStocksService) {}

  // Add or update stock for a specific product
  addOrUpdateStock(productId: number, quantity: number, size: string): Observable<Stock> {
    const body: ProductIdStockBody = {
      quantity: quantity,
      size: size,
    };

    return this.stocksService.apiProductsProductIdStockPost(body, productId).pipe(
      map((response: Stock) => response),
      catchError((error) => {
        console.error(`Failed to add or update stock for product with ID ${productId}:`, error);
        return throwError(() => new Error(`Failed to add or update stock for product with ID ${productId}.`));
      })
    );
  }

  // Update stock details for a specific product and size
  updateStockSize(productId: number, size: string, quantity: number): Observable<Stock> {
    const body: StockSizeBody = { quantity: quantity};

    return this.stocksService.apiProductsProductIdStockSizePut(body, productId, size).pipe(
      map((response: Stock) => response),
      catchError((error) => {
        console.error(`Failed to update stock size for product with ID ${productId}:`, error);
        return throwError(() => new Error(`Failed to update stock size for product with ID ${productId}.`));
      })
    );
  }

  // Retrieve stock details for a specific product
  getStockForProduct(productId: number): Observable<Stock[]> {
    return this.stocksService.apiProductsProductIdStockGet(productId).pipe(
      map((response: Stock[]) => response),
      catchError((error) => {
        console.error(`Failed to fetch stock for product with ID ${productId}:`, error);
        return throwError(() => new Error(`Failed to fetch stock for product with ID ${productId}.`));
      })
    );
  }

  // Get available sizes for a specific product
  getAvailableSizes(productId: number): Observable<string[]> {
    return this.stocksService.apiProductsProductIdStockSizesGet(productId).pipe(
      map((response: string[]) => response),
      catchError((error) => {
        console.error(`Failed to fetch sizes for product with ID ${productId}:`, error);
        return throwError(() => new Error(`Failed to fetch sizes for product with ID ${productId}.`));
      })
    );
  }

  // Delete stock for a specific product
  deleteAllStockForProduct(productId: number): void {
    this.stocksService.apiProductsProductIdStockDelete(productId).pipe(
      map(() => null),
      catchError((error) => {
        console.error(`Failed to delete stock for product with ID ${productId}:`, error);
        return throwError(() => new Error(`Failed to delete stock for product with ID ${productId}.`));
      })
    );
  }

  // Remove stock for a specific size of a product
  deleteStockForSize(productId: number, size: string): Observable<void> {
    return this.stocksService.apiProductsProductIdStockSizeDelete(productId, size).pipe(
      map(() => undefined),
      catchError((error) => {
        console.error(`Failed to delete stock for size ${size} of product with ID ${productId}:`, error);
        return throwError(() => new Error(`Failed to delete stock for size ${size} of product with ID ${productId}.`));
      })
    );
  }
}
