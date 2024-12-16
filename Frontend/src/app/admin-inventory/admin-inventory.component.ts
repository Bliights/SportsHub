import { Component, OnInit } from '@angular/core';
import {ProductsService, StocksService} from '../../generated';
import { AdminNavBarComponent } from '../admin-nav-bar/admin-nav-bar.component';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';

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
  newProduct: any = {
    name: '',
    description: '',
    price: 0,
    category: '',
    brand: '',
    imageUrl: ''
  };
  newStock: any = {
    quantity: 0,
    size: ''
  };

  constructor(private productsService: ProductsService, private stockService: StocksService) {}

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
      this.productsService.apiProductsIdPut(this.editedProduct, this.editedProduct.id).subscribe(() => {
        this.loadProducts();
        this.editedProduct = null;
      });
    }
  }

  cancelEdit(): void {
    this.editedProduct = null;
  }

  addProduct(): void {
    this.productsService.apiProductsPost(this.newProduct).subscribe((createdProduct) => {
      const newStockEntry = {
        quantity: this.newStock.quantity,
        size: this.newStock.size
      };
      // Assuming you have a service method to add stock
      this.stockService.apiProductsProductIdStockPost(newStockEntry,createdProduct.id).subscribe(() => {
        this.loadProducts();
        this.newProduct = {
          name: '',
          description: '',
          price: 0,
          category: '',
          brand: '',
          imageUrl: ''
        };
        this.newStock = {
          quantity: 0,
          size: ''
        };
      });
    });
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
