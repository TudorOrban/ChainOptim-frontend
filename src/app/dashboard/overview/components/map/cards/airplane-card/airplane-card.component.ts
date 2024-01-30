import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-airplane-card',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './airplane-card.component.html',
  styleUrls: ['./airplane-card.component.css', '../../map.component.css'],
})
export class AirplaneCardComponent {
    isCardOpen: boolean = false;

    toggleCard(): void {
        this.isCardOpen = !this.isCardOpen;
    }

    faXmark = faXmark;
}
