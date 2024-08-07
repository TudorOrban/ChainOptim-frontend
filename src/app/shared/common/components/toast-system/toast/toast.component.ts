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
    baseClasses: {[key: string]: boolean} = {};

    ngOnInit(): void {
        console.log('Toast Info', this.toastInfo);
        this.updateOutcomeIcon();
        this.updateClassObject();
    }

    closeToast() {
        this.close.emit(this.toastInfo?.id || -1);
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

    updateClassObject() {
        this.baseClasses = {
          'flex': true,
          'items-center': true,
          'justify-center': true,
          'w-6': true,
          'h-6': true,
          'rounded-full': true
        };
    
        const colorClass = this.getOutcomeColor();
        this.baseClasses[colorClass] = true; 
    }

    getOutcomeColor(): string {
        switch (this.toastInfo?.outcome) {
            case OperationOutcome.SUCCESS:
                return 'text-green-600';
            case OperationOutcome.ERROR:
                return 'text-red-600';
            case OperationOutcome.WARNING:
                return 'text-yellow-600';
            case OperationOutcome.INFO:
                return 'text-blue-600';
            default:
                return 'text-gray-600';
        }
    }

    get classes(): string {
        let colorClass = ''; // Default to an empty string or any default class
        if (this.toastInfo) {
          switch (this.toastInfo.outcome) {
            case OperationOutcome.SUCCESS:
              colorClass = 'text-green-600';
              break;
            case OperationOutcome.ERROR:
              colorClass = 'text-red-600';
              break;
            case OperationOutcome.WARNING:
              colorClass = 'text-yellow-600';
              break;
            case OperationOutcome.INFO:
              colorClass = 'text-blue-600';
              break;
          }
        }
        return `flex items-center justify-center w-6 h-6 rounded-full ${colorClass}`;
      }

    faCheck = faCheck;
    faXmark = faXmark;
    faTriangleExclamation = faTriangleExclamation;
    faInfo = faInfo;
}
