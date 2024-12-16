import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../generated';
import { AdminNavBarComponent } from '../admin-nav-bar/admin-nav-bar.component';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-admin-inventory',
  templateUrl: './admin-inventory.component.html',
  standalone: true,
  imports: [
    AdminNavBarComponent,
    FormsModule,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./admin-inventory.component.css']
})


export class AdminInventoryComponent implements OnInit {
  products: Product[] = [];
  editedProduct: Product | null = null;

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productsService.apiProductsGet().subscribe((products: Product[]) => {
      this.products = products;
    });
  }

  editProduct(product: Product): void {
    this.editedProduct = { ...product };
  }

  saveProduct(): void {
    if (this.editedProduct) {
      this.productsService.apiProductsIdPut(this.editedProduct,this.editedProduct.id).subscribe(() => {
        this.loadProducts();
        this.editedProduct = null;
      });
    }
  }

  cancelEdit(): void {
    this.editedProduct = null;
  }
}

export class Product {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public category!: string;
  public brand!: string;
  public imageUrl!: string;
}
