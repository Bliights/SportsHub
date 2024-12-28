import { inject, Injectable } from '@angular/core';
import {
  Product,
  ProductsService as SwaggerProductsService,
  ApiProductsBody,
  ProductsIdBody,
} from '../../generated';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  constructor(private productsService: SwaggerProductsService ) {}

  // Retrieve a list of all products
  getAllProducts(): Observable<Product[]> {
    return this.productsService.apiProductsGet().pipe(
      map((response: Product[]) => response),
      catchError((error) => {
        console.error('Failed to fetch products:', error);
        return throwError(() => new Error('Failed to fetch products.'));
      })
    );
  }

  // Get details of a specific product
  getProductById(id: number): Observable<Product> {
    return this.productsService.apiProductsIdGet(id).pipe(
      map((response: Product) => response),
      catchError((error) => {
        console.error(`Failed to fetch product with ID ${id}:`, error);
        return throwError(() =>
          new Error(`Failed to fetch product with ID ${id}.`)
        );
      })
    );
  }

  // Delete a product
  deleteProduct(id: number): Observable<void> {
    return this.productsService.apiProductsIdDelete(id).pipe(
      map(() => undefined),
      catchError((error) => {
        console.error(`Failed to delete product with ID ${id}:`, error);
        return throwError(() =>
          new Error(`Failed to delete product with ID ${id}.`)
        );
      })
    );
  }

  // Add a new product
  addProduct(name: string, description: string, price: number, category: string, brand: string, imageUrl: string): Observable<Product> {
    const body: ApiProductsBody = {
      name: name,
      description: description,
      price: price,
      category: category,
      brand: brand,
      imageUrl: imageUrl,
    };

    console.log('body:', body);
    return this.productsService.apiProductsPost(body).pipe(
      map((response: Product) => response),
      catchError((error) => {
        console.error('Failed to add product:', error);
        return throwError(() => new Error('Failed to add product.'));
      })
    );
  }

  // Update product details for a specific product
  updateProduct(productId: number, name?: string, description?: string, price?: number, category?: string, brand?: string, imageUrl?: string): Observable<Product> {
    const product: ProductsIdBody = {};

    // Conditionally add properties only if they are provided
    if (name !== undefined) {
      product.name = name;
    }
    if (description !== undefined) {
      product.description = description;
    }
    if (price !== undefined) {
      product.price = price;
    }
    if (category !== undefined) {
      product.category = category;
    }
    if (brand !== undefined) {
      product.brand = brand;
    }
    if (imageUrl !== undefined) {
      product.imageUrl = imageUrl;
    }

    return this.productsService.apiProductsIdPut(product, productId).pipe(
      map((response: Product) => response),
      catchError((error) => {
        console.error(`Failed to update product with ID ${productId}:`, error);
        return throwError(() =>
          new Error(`Failed to update product with ID ${productId}.`)
        );
      })
    );
  }
}
