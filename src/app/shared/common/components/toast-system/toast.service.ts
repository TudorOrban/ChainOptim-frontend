import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastInfo } from './toastTypes';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
    private toastsSubject = new BehaviorSubject<ToastInfo[]>([]);
    private toastId = 0;

    toasts$ = this.toastsSubject.asObservable();

    addToast(toastInfo: ToastInfo) {
        const newToast = { ...toastInfo, id: ++this.toastId };
        const currentToasts = this.toastsSubject.getValue();
        this.toastsSubject.next([...currentToasts, newToast]);
    }

    removeToast(id: number) {
        const currentToasts = this.toastsSubject.getValue();
        this.toastsSubject.next(currentToasts.filter(toast => toast.id !== id));
    }
}
