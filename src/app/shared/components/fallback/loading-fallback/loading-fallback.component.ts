import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-loading-fallback',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './loading-fallback.component.html',
  styleUrl: './loading-fallback.component.css'
})
export class LoadingFallbackComponent {

    faSpinner = faSpinner;
}
