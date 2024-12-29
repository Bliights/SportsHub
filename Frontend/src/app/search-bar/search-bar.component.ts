import { Component } from '@angular/core';
import {SearchService} from '../search.service';
import {FormsModule} from '@angular/forms';
import {ProductsService} from '../api/products.service';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  searchQuery: string = '';
  suggestions: string[] = [];

  constructor(private searchService: SearchService,private productService: ProductsService) {}

  onSearch() {
    this.searchService.setSearchQuery(this.searchQuery);
  }

  fetchSuggestions(query: string) {
    // No query
    if (!query.trim()) {
      this.suggestions = [];
      return;
    }

    this.productService.getAllProducts().subscribe((allProducts) => {
      this.suggestions = allProducts
        .filter((product) => product.name.toLowerCase().startsWith(query.toLowerCase()))
        .map((product) => product.name)
        .slice(0, 5);
    });
  }


  selectSuggestions(suggestion: string) {
    this.searchQuery = suggestion;
    this.suggestions = [];
    this.onSearch();
  }

}
