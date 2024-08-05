import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TransportRoute, TransportType } from '../../../types/supplyChainMapTypes';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-transport-route-ui',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './transport-route-ui.component.html',
    styleUrls: ['./transport-route-ui.component.css']
})
export class TransportRouteUIComponent {
    @Input() route!: TransportRoute;
    @Output() onRouteSelected = new EventEmitter<TransportRoute>();

    isSelected: boolean = false;
    imageUrl: string = "";

    public initializeData(): void {
        this.updateImageUrl();
    }
    
    updateImageUrl(): void {
        console.log("A:", this.imageUrl); 

        if (!this.route) return;
        

        switch (this.route.transportType) {
            case TransportType.ROAD:
                this.imageUrl = "assets/images/truck-solid.png";
                break;
            case TransportType.RAIL:
                this.imageUrl = "assets/images/train-subway-solid.png";
                break;
            case TransportType.SEA:
                this.imageUrl = "assets/images/boat-with-containers.png";
                break;
            case TransportType.AIR:
                this.imageUrl = "assets/images/black-plane.png";
                break;
            default:
                this.imageUrl = ""; // Default or fallback image
        }
        
        console.log("B:", this.imageUrl); 
    }

    toggleSelection(): void {
        this.isSelected = !this.isSelected;
    }

}
