import { Component,inject, OnInit } from '@angular/core';
import {ProductItemComponent} from '../product-item/product-item.component';
import {ProductDTO, ProductsService} from '../products.service';
import {AsyncPipe, NgForOf} from '@angular/common';
import {combineLatest, map, Observable } from 'rxjs';
import { SearchService } from '../search.service';
@Component({
  selector: 'app-product-area',
  standalone: true,
  imports: [
    ProductItemComponent,
    NgForOf,
    AsyncPipe
  ],
  templateUrl: './product-area.component.html',
  styleUrl: './product-area.component.css'
})
export class ProductAreaComponent implements OnInit {
  products$: Observable<ProductDTO[]>;
  filteredProducts$: Observable<ProductDTO[]> = new Observable<ProductDTO[]>();

  constructor(
    private productsService: ProductsService,
    private searchService: SearchService
  ) {
    this.products$ = this.productsService.getProducts();
  }

  ngOnInit() {
    this.filteredProducts$ = combineLatest([this.products$, this.searchService.searchQuery$]).pipe(
      map(([products, searchQuery]) =>
        products.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    );
  }
}
