import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OperationOutcome, ToastInfo } from '../toastTypes';
import { faCheck, faInfo, faTriangleExclamation, faXmark, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
    @Input() toastInfo: ToastInfo | undefined = undefined;
    @Output() close = new EventEmitter<number>();

    outcomeIcon: IconDefinition = faCheck;

    ngOnInit(): void {
        console.log('Toast Info', this.toastInfo);
        this.updateOutcomeIcon();
    }

    closeToast() {
        this.close.emit(this.toastInfo?.id ?? -1);
    }

    updateOutcomeIcon() {
        switch (this.toastInfo?.outcome) {
            case OperationOutcome.SUCCESS:
                this.outcomeIcon = faCheck;
                break;
            case OperationOutcome.ERROR:
                this.outcomeIcon = faXmark;
                break;
            case OperationOutcome.WARNING:
                this.outcomeIcon = faTriangleExclamation;
                break;
            case OperationOutcome.INFO:
                this.outcomeIcon = faInfo;
                break;
        }
    }
    
    getBackgroundColor(outcome?: OperationOutcome): string {
        switch (outcome) {
            case OperationOutcome.SUCCESS:
                return '#16a34a'; 
            case OperationOutcome.ERROR:
                return '#dc2626';
            case OperationOutcome.WARNING:
                return '#ca8a04'; 
            case OperationOutcome.INFO:
                return '#121212';  
            default:
                return '#121212';
        }
    }

    faCheck = faCheck;
    faXmark = faXmark;
    faTriangleExclamation = faTriangleExclamation;
    faInfo = faInfo;
}
