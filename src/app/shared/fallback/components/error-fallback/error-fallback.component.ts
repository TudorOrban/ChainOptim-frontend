import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-error-fallback',
    standalone: true,
    imports: [],
    templateUrl: './error-fallback.component.html',
    styleUrl: './error-fallback.component.css',
})
export class ErrorFallbackComponent {
    @Input() errorMessage?: string = 'Something went wrong!';

    setError(message: string) {
        this.errorMessage = message ?? "";
    }
}
