import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faBox, faPlus, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router';
import { SortOption } from '../../search/models/Search';
import { SearchInputComponent } from '../../search/components/search-input/search-input.component';
import { SortSelectorComponent } from '../../search/components/sort-selector/sort-selector.component';

@Component({
  selector: 'app-table-toolbar',
  standalone: true,
  imports: [FontAwesomeModule, RouterModule, SearchInputComponent, SortSelectorComponent],
  templateUrl: './table-toolbar.component.html',
  styleUrl: './table-toolbar.component.css'
})
export class TableToolbarComponent {
    @Input() title: string = '';
    @Input() createName: string = '';
    @Input() searchPlaceholder: string = 'Search...';
    @Input() sortOptions: SortOption[] = [
        { label: 'Created At', value: 'createdAt' },
        { label: 'Updated At', value: 'updatedAt' },
    ];

    @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();
    @Output() onSortChange = new EventEmitter<{ value: string, ascending: boolean }>();

    performSearch(searchQuery: string): void {
        this.onSearch.emit(searchQuery);
    }
    
    handleSortChange(sortData: { value: string, ascending: boolean }): void {
        this.onSortChange.emit(sortData);
    }

    faBox = faBox;
    faPlus = faPlus;
}
