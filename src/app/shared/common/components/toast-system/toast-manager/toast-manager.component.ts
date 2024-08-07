import { Component, OnDestroy, OnInit } from '@angular/core';
import { OperationOutcome, ToastInfo } from '../toastTypes';
import { ToastService } from '../toast.service';
import { ToastComponent } from '../toast/toast.component';
import { CommonModule } from '@angular/common';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-toast-manager',
  standalone: true,
  imports: [ToastComponent, CommonModule],
  templateUrl: './toast-manager.component.html',
  styleUrl: './toast-manager.component.css'
})
export class ToastManagerComponent implements OnInit, OnDestroy {
    toasts: ToastInfo[] = [];
    private subscriptions = new Map<number, Subscription>();

    constructor(
        private toastService: ToastService
    ) {}

    ngOnInit(): void {
        this.toastService.toasts$.subscribe(toasts => {
            // Subscribe to new list of toasts and handle them
            toasts.forEach(toast => {
                if (!this.subscriptions.has(toast.id)) {
                    this.handleToast(toast);
                }
            });
            this.toasts = toasts;
        });
    }

    handleToast(toast: ToastInfo) {
        // Set a timeout to automatically close the toast based on its outcome
        const delay = this.getDelayForOutcome(toast.outcome);
        const sub = timer(delay).subscribe(() => {
            this.closeToast(toast.id);
        });

        this.subscriptions.set(toast.id, sub);
    }

    getDelayForOutcome(outcome: OperationOutcome): number {
        switch (outcome) {
            case OperationOutcome.SUCCESS:
                return 3000;
            case OperationOutcome.ERROR:
                return 10000;
            case OperationOutcome.WARNING:
                return 5000;
            case OperationOutcome.INFO:
                return 5000;
            default:
                return 5000;
        }
    }

    closeToast(id: number): void {
        console.log('Closing toast with id', id);
        this.toastService.removeToast(id);
    }

    unsubscribeToast(id: number) {
        this.subscriptions.get(id)?.unsubscribe();
        this.subscriptions.delete(id);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
