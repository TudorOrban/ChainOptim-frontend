import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.css'
})
export class SearchInputComponent {
    @Input() placeholder: string = 'Search...';
    @Output() searchEvent = new EventEmitter<string>();

    searchQuery: string = '';

    onSearch(): void {
        this.searchEvent.emit(this.searchQuery);
    }

    faSearch = faSearch;
}
