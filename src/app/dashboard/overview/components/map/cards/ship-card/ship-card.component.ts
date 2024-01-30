import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-ship-card',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './ship-card.component.html',
  styleUrls: ['./ship-card.component.css', '../../map.component.css'],
})
export class ShipCardComponent {
    isCardOpen: boolean = false;

    toggleCard(): void {
        this.isCardOpen = !this.isCardOpen;
    }

    faXmark = faXmark;
}
