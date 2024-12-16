import { inject, Injectable } from '@angular/core';
import {map, Observable, of, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ProductsService as SwaggerProductsService } from '../generated';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly swaggerService = inject(SwaggerProductsService);

  getProducts(): Observable<ProductDTO[]> {
    return this.swaggerService.apiProductsGet().pipe(
      map((data: ProductDTO[]) => data.map((item) => new ProductModel(item)))
    );
  }

  getProductPrice(productId: number): Observable<number> {
    return this.swaggerService.apiProductsIdGet(productId).pipe(
      map((product: any) => {
        if (!product || typeof product.price !== 'number') {
          throw new Error(`Invalid product data for ID: ${productId}`);
        }
        return product.price; // Retourne le prix
      }),
      catchError((error) => {
        console.error(`Failed to fetch price for product ID: ${productId}`, error);
        return of(0); // Retourne 0 en cas d'erreur
      })
    );
  }
  getProductName(productId: number): Observable<string> {
    return this.swaggerService.apiProductsIdGet(productId).pipe(
      map((product: any) => {
        if (!product || typeof product.name !== 'string') {
          throw new Error(`Invalid product data for ID: ${productId}`);
        }
        return product.name; // Retourne le prix
      }),
      catchError((error) => {
        console.error(`Failed to fetch price for product ID: ${productId}`, error);
        return ""; // Retourne 0 en cas d'erreur
      })
    );
  }

  constructor() { }
}

export interface ProductDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  imageUrl: string;
  quantity?: number;
}

export class ProductModel {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public category!: string;
  public brand!: string;
  public imageUrl!: string;
  public quantity!: number;
  constructor(src: ProductDTO) {
    this.id = src.id||-1;
    this.name = src.name||'';
    this.description = src.description||'';
    this.price = src.price||0;
    this.category = src.category||'';
    this.brand = src.brand||'';
    this.imageUrl = src.imageUrl||'';
    this.quantity = 1;
  }
}
