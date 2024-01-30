import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-factory-card',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './factory-card.component.html',
  styleUrls: ['./factory-card.component.css', '../../map.component.css'],
})
export class FactoryCardComponent {

    isCardOpen: boolean = false;

    toggleCard(): void {
        this.isCardOpen = !this.isCardOpen;
    }

    faXmark = faXmark;
}
