import { Component } from '@angular/core';
import {SearchService} from '../search.service';
import {FormsModule} from '@angular/forms';
import {ProductAreaComponent} from '../product-area/product-area.component';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  searchQuery: string = '';

  constructor(private searchService: SearchService) {}

  onSearch() {
    this.searchService.setSearchQuery(this.searchQuery);
  }
}
