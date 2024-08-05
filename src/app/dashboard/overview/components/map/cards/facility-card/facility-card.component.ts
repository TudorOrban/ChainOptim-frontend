import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Facility, FacilityType } from '../../../../types/supplyChainMapTypes';

@Component({
  selector: 'app-facility-card',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './facility-card.component.html',
  styleUrl: './facility-card.component.css',
})
export class FacilityCardComponent {
    @Input() facility!: Facility;

    isCardOpen: boolean = false;
    imageUrl: string = "";

    public initializeData(): void {
        this.updateImageUrl();
    }

    updateImageUrl(): void {
        if (!this.facility) return;
        

        switch (this.facility.type) {
            case FacilityType.FACTORY:
                this.imageUrl = "assets/images/factory.png";
                break;
            case FacilityType.WAREHOUSE:
                this.imageUrl = "assets/images/warehouse.png";
                break;
            case FacilityType.SUPPLIER:
                this.imageUrl = "assets/images/truck-arrow-right-solid.png";
                break;
            case FacilityType.CLIENT:
                this.imageUrl = "assets/images/universal-access-solid.png";
                break;
            default:
                console.error("Facility type not recognized:", this.facility.type);
                this.imageUrl = ""; // Default or fallback image
        }
        
    }

    toggleCard(): void {
        this.isCardOpen = !this.isCardOpen;
    }

    faXmark = faXmark;
}
