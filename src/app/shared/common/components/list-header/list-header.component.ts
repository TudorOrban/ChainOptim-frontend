import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faPlus } from '@fortawesome/free-solid-svg-icons';
import { SearchInputComponent } from '../../../search/components/search-input/search-input.component';
import { SortSelectorComponent } from '../../../search/components/sort-selector/sort-selector.component';

@Component({
  selector: 'app-list-header',
  standalone: true,
  imports: [FontAwesomeModule, SearchInputComponent, SortSelectorComponent],
  templateUrl: './list-header.component.html',
  styleUrl: './list-header.component.css'
})
export class ListHeaderComponent {

    performSearch(searchQuery: string): void {
        console.log('Searching for:', searchQuery);
    }

    faBox = faBox;
    faPlus = faPlus;
}
