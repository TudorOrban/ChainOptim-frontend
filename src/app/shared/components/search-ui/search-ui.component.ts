import { Component, Output } from '@angular/core';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-search-ui',
  standalone: true,
  imports: [],
  templateUrl: './search-ui.component.html',
  styleUrl: './search-ui.component.css'
})
export class SearchUIComponent {
    searchTerm: string = "";
    @Output() search = new EventEmitter();

    onSearch() {
        this.search.emit(this.searchTerm)
    }
}
