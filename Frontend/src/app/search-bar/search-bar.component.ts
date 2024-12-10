// src/app/search-bar/search-bar.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  standalone: true,
  imports: [FormsModule],
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  searchQuery: string = '';

  constructor(private searchService: SearchService) {}

  onSearch() {
    this.searchService.setSearchQuery(this.searchQuery);
  }
}
