import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TransportRoute, TransportType } from '../../../types/supplyChainMapTypes';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-transport-route-ui',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule],
    templateUrl: './transport-route-ui.component.html',
    styleUrls: ['./transport-route-ui.component.css']
})
export class TransportRouteUIComponent {
    @Input() route!: TransportRoute;
    @Output() onRouteSelected = new EventEmitter<TransportRoute>();

    isSelected: boolean = false;
    imageUrl: string = "";
    estimatedProgress: number = 0;

    public initializeData(): void {
        this.updateImageUrl();
        this.computeMetrics();
    }
    
    updateImageUrl(): void {
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
                this.imageUrl = ""; 
        }
        
    }

    toggleSelection(): void {
        this.isSelected = !this.isSelected;
    }

    computeMetrics(): void {
        if (this.route.departureDateTime && this.route.estimatedArrivalDateTime) {
            const totalDuration = this.route.estimatedArrivalDateTime.getTime() - this.route.departureDateTime.getTime();
            const elapsedDuration = new Date().getTime() - this.route.departureDateTime.getTime();
            this.estimatedProgress = elapsedDuration / totalDuration;
        }
    }

    faXmark = faXmark;
}
