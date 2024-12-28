import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchQueryChangedSource = new Subject<string>();
  searchQueryChanged$ = this.searchQueryChangedSource.asObservable();
  searchQuery: string = '';

  constructor() { }

  setSearchQuery(query: string) {
    this.searchQuery = query;
    this.searchQueryChangedSource.next(query);
  }
}
