import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowDownShortWide, faArrowUpWideShort, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { SortOption } from '../../models/Search';

@Component({
  selector: 'app-sort-selector',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './sort-selector.component.html',
  styleUrl: './sort-selector.component.css'
})
export class SortSelectorComponent {
    @Input() sortOptions: SortOption[] = [
        { label: 'Created At', value: 'createdAt' },
        { label: 'Updated At', value: 'updatedAt' },
    ];

    @Output() sortChange = new EventEmitter<{ value: string, ascending: boolean }>();
    
    currentSortOption: SortOption = this.sortOptions[0];
    ascending: boolean = true;
    isOpen: boolean = false;

    faArrowUpWideShort = faArrowUpWideShort;
    faArrowDownShortWide = faArrowDownShortWide;
    faChevronDown = faChevronDown;

    toggleSortOrder(): void {
        this.ascending = !this.ascending;
        this.emitSortChange();
    }

    selectSortOption(option: SortOption): void {
        this.currentSortOption = option;
        this.emitSortChange();
        this.isOpen = false;
    }

    toggleDropdown(): void {
        this.isOpen = !this.isOpen;
    }

    private emitSortChange(): void {
        this.sortChange.emit({ value: this.currentSortOption.value, ascending: this.ascending });
    }
}
