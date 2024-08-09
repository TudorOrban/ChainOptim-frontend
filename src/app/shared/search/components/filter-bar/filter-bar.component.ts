import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterOption, FilterType } from '../../../common/models/reusableTypes';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.css'
})
export class FilterBarComponent {
    @Input() filterOptions: FilterOption[] = [];
    @Output() filterChange = new EventEmitter<{key: string, value: string}>();

    selectedKey: string | undefined = undefined;
    selectedNumberValue: number | undefined = undefined;
    selectedEnumValue: string | undefined = undefined;
    selectedDate: string | undefined = undefined;
    isGreaterThan: boolean = true;

    updateFilter(): void {
        console.log("Filter updated: ", this.selectedDate);
        const filterOption = this.findCurrentFilterType();
        if (!filterOption) return;

        let value: any;
        switch (filterOption.filterType) {
            case FilterType.NUMBER:
                value = this.selectedNumberValue;
                break;
            case FilterType.ENUM:
                value = this.selectedEnumValue;
                break;
            case FilterType.DATE:
                value = this.formatAsLocalDateTime(this.selectedDate || "");
                break;
        }

        if (value !== undefined) {
            this.filterChange.emit({key: this.getRealKey()!, value});
        }
    }

    getValueOptions() {
        const filterOption = this.findCurrentFilterType();
        return filterOption ? filterOption.valueOptions : [];
    }

    shouldShowSelect(): boolean {
        const filterOption = this.findCurrentFilterType();
        return filterOption ? filterOption.filterType == FilterType.ENUM : false;
    }

    shouldShowInput(): boolean {
        const filterOption = this.findCurrentFilterType();
        return filterOption ? filterOption.filterType == FilterType.NUMBER : false;
    }

    shouldShowDate(): boolean {
        const filterOption = this.findCurrentFilterType();
        return filterOption ? filterOption.filterType == FilterType.DATE : false;
    }

    toggleGreaterThan(): void {
        this.isGreaterThan = !this.isGreaterThan;
        this.updateFilter();
    }

    private findCurrentFilterType(): FilterOption | undefined {
        return this.findFilterType(this.selectedKey);
    }

    private findFilterType(key: string | undefined) {
        return this.filterOptions.find(option => option.key.value === key);
    }

    private getRealKey(): string | undefined {
        const option = this.findCurrentFilterType();
        switch (option?.filterType) {
            case FilterType.NUMBER:
                return this.isGreaterThan ? `greaterThan${this.selectedKey}` : `lessThan${this.selectedKey}`;
            case FilterType.DATE:
                return this.isGreaterThan ? `${this.selectedKey}Start` : `${this.selectedKey}End`;
            default:
                return this.selectedKey;
        }
    }
    
    formatAsLocalDateTime(dateString: string): string | undefined {
        try {
            const date = parseISO(dateString);
            return format(date, "yyyy-MM-dd'T'HH:mm:ss");
        } catch(e) {
            return undefined;
        }
    }
}
