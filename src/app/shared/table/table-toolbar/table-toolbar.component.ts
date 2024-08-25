import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
    faArrowRotateRight,
    faBox,
    faEdit,
    faPlus,
    faSave,
    faTrash,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router';
import { FilterOption, SortOption } from '../../search/models/searchTypes';
import { SearchInputComponent } from '../../search/components/search-input/search-input.component';
import { SortSelectorComponent } from '../../search/components/sort-selector/sort-selector.component';
import { CommonModule } from '@angular/common';
import { FilterBarComponent } from '../../search/components/filter-bar/filter-bar.component';
import { Feature } from '../../enums/commonEnums';
import { InfoComponent } from '../../common/components/info/info.component';

@Component({
    selector: 'app-table-toolbar',
    standalone: true,
    imports: [
        FontAwesomeModule,
        RouterModule,
        CommonModule,
        SearchInputComponent,
        SortSelectorComponent,
        FilterBarComponent,
        InfoComponent
    ],
    templateUrl: './table-toolbar.component.html',
    styleUrl: './table-toolbar.component.css',
})
export class TableToolbarComponent {
    @Input() title: string = '';
    @Input() searchPlaceholder: string = 'Search...';
    @Input() dontPadHorizontally: boolean = false;

    @Input() sortOptions: SortOption[] = [
        { label: 'Created At', value: 'createdAt' },
        { label: 'Updated At', value: 'updatedAt' },
    ];
    @Input() filterOptions: FilterOption[] = [];
    @Input() selectedItemIds = new Set<number>();
    @Input() newRawItems: any[] = [];
    @Input() isEditing: boolean = false;
    @Input() feature?: Feature;

    @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();
    @Output() onSortChange = new EventEmitter<{ value: string; ascending: boolean; }>();
    @Output() onFilterChange = new EventEmitter<{ key: string; value: string; }>();
    @Output() onRefresh: EventEmitter<void> = new EventEmitter<void>();
    @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
    @Output() onAddItem: EventEmitter<void> = new EventEmitter<void>();
    @Output() onCreateItems: EventEmitter<void> = new EventEmitter<void>();
    @Output() onEditItems: EventEmitter<void> = new EventEmitter<void>();
    @Output() onDeleteItems: EventEmitter<void> = new EventEmitter<void>();
    @Output() onSaveEditedItems: EventEmitter<void> = new EventEmitter<void>();

    performSearch(searchQuery: string): void {
        this.onSearch.emit(searchQuery);
    }

    handleSortChange(sortData: { value: string; ascending: boolean }): void {
        this.onSortChange.emit(sortData);
    }

    handleFilterChange(filterData: { key: string; value: string }): void {
        this.onFilterChange.emit(filterData);
    }

    handleRefresh(): void {
        this.onRefresh.emit();
    }

    handleCancelSelection(): void {
        this.onCancel.emit();
    }

    handleAddItem(): void {
        this.onAddItem.emit();
    }

    handleCreateItems(): void {
        this.onCreateItems.emit();
    }

    handleEditItems(): void {
        this.onEditItems.emit();
    }

    handleSaveEditedItems(): void {
        this.onSaveEditedItems.emit();
    }

    handleDeleteItems(): void {
        this.onDeleteItems.emit();
    }

    faBox = faBox;
    faPlus = faPlus;
    faArrowRotateRight = faArrowRotateRight;
    faEdit = faEdit;
    faTrash = faTrash;
    faXmark = faXmark;
    faSave = faSave;
}
