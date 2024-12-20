import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmDialogInput } from '../../models/confirmDialogTypes';

@Component({
    selector: 'app-generic-confirm-dialog',
    standalone: true,
    imports: [],
    templateUrl: './generic-confirm-dialog.component.html',
    styleUrl: './generic-confirm-dialog.component.css',
})
export class GenericConfirmDialogComponent<T> {
    @Input() data: T | undefined = undefined;
    @Input() dialogInput: ConfirmDialogInput | undefined = undefined;
    @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    onConfirm(): void {
        this.confirm.emit();
    }

    onCancel(): void {
        this.cancel.emit();
    }
}
