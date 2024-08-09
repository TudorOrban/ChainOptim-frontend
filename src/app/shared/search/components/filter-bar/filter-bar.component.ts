import { Component, Input, OnInit } from '@angular/core';
import { FilterOption, FilterType, UIItem } from '../../../common/models/reusableTypes';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.css'
})
export class FilterBarComponent {
    @Input() filterOptions: FilterOption[] = [];
    // @Input() searchParams: string = '';

    selectedKey: string | undefined = undefined;
    selectedValue: string | undefined = undefined;
    selectedDate: string | undefined = undefined;


    getValueOptions() {
        const filterOption = this.findOption();
        return filterOption ? filterOption.valueOptions : [];
    }

    shouldShowSelect(): boolean {
        const filterOption = this.findOption();
        return filterOption ? filterOption.filterType == FilterType.ENUM : false;
    }

    shouldShowInput(): boolean {
        const filterOption = this.findOption();
        return filterOption ? filterOption.filterType == FilterType.NUMBER : false;
    }

    shouldShowDate(): boolean {
        const filterOption = this.findOption();
        return filterOption ? filterOption.filterType == FilterType.DATE : false;
    }

    private findOption(): FilterOption | undefined {
        return this.filterOptions.find(option => option.key.value === this.selectedKey);
    }
}
