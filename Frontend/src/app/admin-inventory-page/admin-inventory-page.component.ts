import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AdminNavBarComponent} from "../admin-nav-bar/admin-nav-bar.component";
import {AgGridAngular} from "ag-grid-angular";
import {Product, Stock} from '../../generated';
import {
  AllCommunityModule,
  ColDef,
  ModuleRegistry,
} from 'ag-grid-community';
import {ProductsService} from '../api/products.service';
import {StocksService} from '../api/stocks.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
ModuleRegistry.registerModules([AllCommunityModule]);


@Component({
  selector: 'app-admin-inventory-page',
  standalone: true,
  imports: [
    AdminNavBarComponent,
    AgGridAngular,
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './admin-inventory-page.component.html',
  styleUrl: './admin-inventory-page.component.css'
})
export class AdminInventoryPageComponent implements OnInit{
  products: Product[] = [];
  stocks: Stock[] = [];
  @ViewChild('stockModal', { static: true }) stockModal!: TemplateRef<any>;
  @ViewChild('createProductModal', { static: true }) createProductModal!: TemplateRef<any>;
  @ViewChild('createStockModal', { static: true }) createStockModal!: TemplateRef<any>;
  createProductForm!: FormGroup;
  createStockForm!: FormGroup;

  productColumnDefs: ColDef[] = [
    {
      headerName: 'Actions',
      filter: false,
      cellRenderer: (params: any) => {
        return `
        <button class="btn btn-danger btn-sm me-1">Delete</button>
        <button class="btn btn-secondary btn-sm">Edit Stock</button>
      `;
      },
      onCellClicked: (params: any) => {
        const action = params.event.target.innerText;
        if (action === 'Delete') {
          this.deleteProduct(params.data.id);
        } else if (action === 'Edit Stock') {
          this.openEditStockModal(params.data);
        }
      },
    },
    { field: 'id', headerName: 'ID' },
    { field: 'name',
      headerName: 'Name',
      editable: true,
      cellEditor: 'agTextCellEditor',
    },
    { field: 'description',
      headerName: 'Description',
      editable: true,
      cellEditor: 'agTextCellEditor',
    },
    { field: 'price',
      headerName: 'Price',
      editable: true,
      cellEditor: 'agNumberCellEditor',
    },
    { field: 'category',
      headerName: 'Category',
      editable: true,
      cellEditor: 'agTextCellEditor',
    },
    { field: 'brand', headerName: 'Brand'},
    { field: 'imageUrl', headerName: 'Url of Image'},
  ];

  stockColumnDefs: ColDef[] = [
    {
      headerName: 'Actions',
      filter: false,
      cellRenderer: (params: any) => {
        return `
        <button class="btn btn-danger btn-sm me-1">Delete</button>
      `;
      },
      onCellClicked: (params: any) => {
        const action = params.event.target.innerText;
        if (action === 'Delete') {
          this.deleteStock(params.data.productId, params.data.size);
        }
      },
    },
    { field: 'id', headerName: 'ID' },
    { field: 'productId', headerName: 'Product ID' },
    { field: 'quantity',
      headerName: 'Quantity',
      editable: true,
      cellEditor: 'agNumberCellEditor',
    },
    { field: 'size', headerName: 'Size',},
  ];

  constructor(private productsService: ProductsService,
              private stocksService: StocksService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder) {
  }

  selectedProduct: any = null;

  defaultColDef: ColDef = {filter: "agTextColumnFilter", floatingFilter: true,};
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50];
  public paginationPageSize = 10;

  ngOnInit(): void {
    this.loadProducts();
    this.createProductForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      brand: ['', [Validators.required]],
      imageUrl: ['', Validators.pattern('(https?://.*\\.(?:png|jpg|jpeg))')]
    });
    this.createStockForm = this.formBuilder.group({
      size: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]]
    });
  }

  // Load all products
  loadProducts(): void {
    this.productsService.getAllProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }

  // Load all stocks for a product
  loadStocks(productId: number): void {
    this.stocksService.getStockForProduct(productId).subscribe((stocks: Stock[]) => {
      this.stocks = stocks;
    });
  }

  // Update product
  onProductChanged(event: any): void {
    const product = event.data;

    this.productsService.updateProduct(product.id, product.name, product.description, product.price, product.category, product.brand, product.imageUrl).subscribe({
      next: (updated) => {
        console.log('Product updated successfully:', updated);
        this.loadProducts();
      },
      error: (err) => {
        console.error('Failed to update product:', err);
      },
    });
  }

  // Update stock
  onStockChanged(event: any): void {
    const stock = event.data;

    this.stocksService.updateStockSize(stock.productId, stock.size, stock.quantity).subscribe({
      next: (updated) => {
        console.log('Stock updated successfully:', updated);
        this.loadStocks(stock.productId);
      },
      error: (err) => {
        console.error('Failed to update stock:', err);
      },
    });
  }

  // Delete product
  deleteProduct(productId: number): void {
    this.productsService.deleteProduct(productId).subscribe({
      next: () => {
        console.log(`Product ${productId} deleted successfully`);
        this.loadProducts();
      },
      error: (err) => {
        console.error('Failed to delete product:', err);
      },
    });
  }

  // Delete stock
  deleteStock(productId: number, size: string): void {
    this.stocksService.deleteStockForSize(productId, size).subscribe({
      next: () => {
        console.log(`Stock for ${productId} and size ${size} deleted successfully`);
        this.loadStocks(productId);
      },
      error: (err) => {
        console.error('Failed to delete stock:', err);
      },
    });
  }

  // Open product modal
  openCreateProductModal(): void {
    this.modalService.open(this.createProductModal, { size: 'lg', centered: true });
  }

  // Open stock modal
  openCreateStockModal(): void {
    this.modalService.open(this.createStockModal, { size: 'lg', centered: true });
  }

  // Open edit stock modal
  openEditStockModal(product: Product): void {
    this.selectedProduct = product;
    this.loadStocks(product.id);
    this.modalService.open(this.stockModal, { size: 'xl' });
  }

  // Create a new product
  createProduct(modal:any): void {
    if (this.createProductForm.invalid) {
      this.createProductForm.markAllAsTouched();
      return;
    }

    // Create a new product
    const { name, description, price, category, brand, imageUrl} = this.createProductForm.value;
    this.productsService.addProduct(name, description, price, category, brand, imageUrl).subscribe({
      next: () => {
        console.log(`Product ${name} add successfully`);
        this.loadProducts();
      },
      error: (err) => {
        console.error('Failed to add product:', err);
      },
    });

    // Reset the form and close the modal
    this.createProductForm.reset({
      name: '',
      description: '',
      price: 0,
      category: '',
      brand: '',
      imageUrl: ''
    });
    modal.dismiss();
  }

  // Create a new stock
  createStock(modal: any): void {
    if (this.createStockForm.invalid) {
      this.createStockForm.markAllAsTouched();
      return;
    }

    // Create a new stock
    const { size, quantity } = this.createStockForm.value;
    this.stocksService.addOrUpdateStock(this.selectedProduct.id, quantity, size).subscribe({
      next: () => {
        console.log(`Stock ${size} add successfully`);
        this.loadStocks(this.selectedProduct.id);
      },
      error: (err) => {
        console.error('Failed to add stock:', err);
      },
    });

    // Reset the form and close the modal
    this.createStockForm.reset({
      size: '',
      quantity: 0,
    });
    modal.dismiss();
  }
}
