import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Facility, FacilityType } from '../../../../types/supplyChainMap';

@Component({
  selector: 'app-facility-card',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './facility-card.component.html',
  styleUrls: ['./facility-card.component.css', '../../map.component.css'],
})
export class FacilityCardComponent {
    @Input() facility!: Facility;

    isCardOpen: boolean = false;
    imageUrl: string = "";

    public initializeData(): void {
        this.updateImageUrl();
    }

    updateImageUrl(): void {
        console.log("A:", this.imageUrl); 
        console.log("Facility data:", this.facility);

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
        
        console.log("B:", this.imageUrl); 
    }

    toggleCard(): void {
        this.isCardOpen = !this.isCardOpen;
    }

    logFacility() {
        console.log("Facility: ", this.facility);
    }

    faXmark = faXmark;
}
