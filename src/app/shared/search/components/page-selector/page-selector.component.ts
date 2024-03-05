import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-page-selector',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './page-selector.component.html',
  styleUrl: './page-selector.component.css'
})
export class PageSelectorComponent {
    @Input() page: number = 1;
    @Input() itemsPerPage: number = 10;
    @Input() totalItems: number = 0;

    readonly MAX_DISPLAY_PAGES = 7;

    get totalPages(): number {
        return Math.ceil(this.totalItems / this.itemsPerPage);
    }

    get displayPages(): number[] {
        const start = Math.max(1, this.page - Math.floor(this.MAX_DISPLAY_PAGES / 2));
        const end = Math.min(this.totalPages, start + this.MAX_DISPLAY_PAGES - 1);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
    
    @Output() pageChange = new EventEmitter<number>();

    changePage(page: number): void {
        this.pageChange.emit(page);
    }

    faCaretLeft = faCaretLeft;
    faCaretRight = faCaretRight;
}
