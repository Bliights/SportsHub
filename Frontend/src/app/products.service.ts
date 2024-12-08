import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly httpClient = inject(HttpClient);

  getProducts(): Observable<ProductDTO[]> {
    return this.httpClient.get<ProductDTO[]>('/api/products');
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
}

export class ProductModel {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public category!: string;
  public brand!: string;
  public imageUrl!: string;
  constructor(src: ProductModel) {
    this.id = src.id||-1;
    this.name = src.name||'';
    this.description = src.description||'';
    this.price = src.price||0;
    this.category = src.category||'';
    this.brand = src.brand||'';
    this.imageUrl = src.imageUrl||'';
  }
}
