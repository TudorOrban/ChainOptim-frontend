import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-select-duration',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './select-duration.component.html',
    styleUrl: './select-duration.component.css',
})
export class SelectDurationComponent {
    @Output() durationChange = new EventEmitter<number>();

    inputValue: number | undefined = undefined;
    options: string[] = ['Hours', 'Days', 'Weeks', 'Months'];
    selectedOption: string = 'Hours';

    onInputValueChange(): void {
        this.emitDuration();
    }

    onOptionChange(): void {
        this.emitDuration();
    }

    emitDuration(): void {
        const durationHours = this.getDurationHours();
        this.durationChange.emit(durationHours);
    }

    getDurationHours(): number {
        if (this.inputValue === undefined) {
            return 0;
        }

        switch (this.selectedOption) {
            case 'Hours':
                return this.inputValue;
            case 'Days':
                return this.inputValue * 24;
            case 'Weeks':
                return this.inputValue * 24 * 7;
            case 'Months':
                return this.inputValue * 24 * 30;
            default:
                return 0;
        }
    }
}