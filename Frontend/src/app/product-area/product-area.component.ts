import {Component, OnInit} from '@angular/core';
import {ProductsService} from '../api/products.service';
import {SearchService} from '../search.service';
import {Product} from '../../generated';
import {NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-product-area',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './product-area.component.html',
  styleUrl: './product-area.component.css'
})
export class ProductAreaComponent implements OnInit{
  allProducts: Product[] = [];
  products: Product[] = [];
  paginatedProducts: Product[] = [];
  selectedCategory: string | null = null;

  currentPage = 1;
  itemsPerPage = 18;
  totalPages = 0;

  constructor(
    private productsService: ProductsService,
    private searchService: SearchService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.loadProducts();
    this.filter();
  }

  // Load all products
  loadProducts(): void {
    this.productsService.getAllProducts().subscribe((allProducts: Product[]) => {
      this.allProducts = allProducts;
      this.applyFilters('');
    });
  }

  // Filter products based on search query and apply filter when search query changes
  filter(): void {
    this.searchService.searchQueryChanged$.subscribe((searchQuery) => {
      this.applyFilters(searchQuery);
    });
  }

  // apply filters to products
  applyFilters(searchQuery: string): void {
    let filteredProducts = this.allProducts;

    // Filter by category
    if (this.selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === this.selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    this.products = filteredProducts;
    this.calculatePagination();
  }

  //Pagination methods
  calculatePagination(): void {
    this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
    this.updatePaginatedProducts();
  }

  updatePaginatedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.products.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedProducts();
  }

  // Method to filter products by category
  filterByCategory(category: string | null): void {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.applyFilters(this.searchService.searchQuery);
  }

  // View product details
  viewProductDetails(productId: number): void {
    this.router.navigate([`/product/${productId}`]);
  }
}
