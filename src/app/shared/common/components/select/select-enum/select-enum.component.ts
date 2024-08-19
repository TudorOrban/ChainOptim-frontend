import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-enum',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-enum.component.html',
  styleUrl: './select-enum.component.css'
})
export class SelectEnumComponent implements OnInit {
    enumValues: any[] = [];

    @Input() set enumType(value: any) {
        if (value) {
            this.enumValues = Object.keys(value)
                .filter(key => isNaN(Number(key)))  
                .map(key => ({ key: key, value: value[key] }));
        }
    }

    @Input() initialValue: string | undefined;

    @Output() selectionChange: EventEmitter<string> = new EventEmitter<string>();

    selectedValue: string | undefined;

    ngOnInit(): void {
        if (this.initialValue) {
            const initialKey = this.enumValues.find(item => item.value === this.initialValue)?.key;
            this.selectedValue = initialKey;
        }
    }

    onChange(newValue: string) {
        const isNumericEnum = typeof this.enumValues[0]?.value === 'number';
        const selectedKey = this.enumValues.find(item => isNumericEnum ? item.value === +newValue : item.value === newValue)?.key;
    
        if (selectedKey) {
            this.selectionChange.emit(selectedKey);
        } else {
            console.log("No matching enum key found for value:", newValue);
            this.selectionChange.emit(undefined);
        }
    }
    

    toTitleCase(text: string): string {
        return text.toLowerCase().replace(/(?:^|\s)\w/g, (match) => match.toUpperCase()).replace(/_/g, ' ');
    }
}