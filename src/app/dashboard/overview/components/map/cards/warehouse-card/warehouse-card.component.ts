import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-warehouse-card',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './warehouse-card.component.html',
  styleUrls: ['./warehouse-card.component.css', '../../map.component.css'],
})
export class WarehouseCardComponent {
    isCardOpen: boolean = false;

    toggleCard(): void {
        this.isCardOpen = !this.isCardOpen;
    }

    faXmark = faXmark;
}
