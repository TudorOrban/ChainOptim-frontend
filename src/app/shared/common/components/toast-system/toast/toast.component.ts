import { Component, Input } from '@angular/core';
import { OperationOutcome, ToastInfo } from '../toastTypes';
import { faCheck, faInfo, faTriangleExclamation, faXmark, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
    @Input() toastInfo: ToastInfo | undefined = undefined;

    outcomeIcon: IconDefinition = faCheck;

    ngOnInit(): void {
        console.log('Toast Info', this.toastInfo);
        this.updateOutcomeIcon();
    }

    closeToast() {

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

    faCheck = faCheck;
    faXmark = faXmark;
    faTriangleExclamation = faTriangleExclamation;
    faInfo = faInfo;
}
