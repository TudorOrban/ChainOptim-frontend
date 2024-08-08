import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faArrowRotateRight, faBox, faEdit, faPlus, faQuestion, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router';
import { SortOption } from '../../search/models/Search';
import { SearchInputComponent } from '../../search/components/search-input/search-input.component';
import { SortSelectorComponent } from '../../search/components/sort-selector/sort-selector.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-toolbar',
  standalone: true,
  imports: [FontAwesomeModule, RouterModule, CommonModule, SearchInputComponent, SortSelectorComponent],
  templateUrl: './table-toolbar.component.html',
  styleUrl: './table-toolbar.component.css'
})
export class TableToolbarComponent {
    @Input() title: string = '';
    @Input() searchPlaceholder: string = 'Search...';
    @Input() sortOptions: SortOption[] = [
        { label: 'Created At', value: 'createdAt' },
        { label: 'Updated At', value: 'updatedAt' },
    ];
    @Input() selectedItemIds = new Set<number>();

    @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();
    @Output() onSortChange = new EventEmitter<{ value: string, ascending: boolean }>();
    @Output() onCancelSelection: EventEmitter<void> = new EventEmitter<void>();
    @Output() onAddItem: EventEmitter<void> = new EventEmitter<void>();

    performSearch(searchQuery: string): void {
        this.onSearch.emit(searchQuery);
    }
    
    handleSortChange(sortData: { value: string, ascending: boolean }): void {
        this.onSortChange.emit(sortData);
    }

    handleCancelSelection(): void {
        this.onCancelSelection.emit();
    }

    handleAddItem(): void {
        this.onAddItem.emit();
    }

    faBox = faBox;
    faPlus = faPlus;
    faArrowRotateRight = faArrowRotateRight;
    faEdit = faEdit;
    faTrash = faTrash;
    faXmark = faXmark;
}
