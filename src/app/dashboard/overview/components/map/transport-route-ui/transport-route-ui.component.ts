import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { EntityType, Pair, TransportRoute, TransportType } from '../../../../goods/models/TransportRoute';

@Component({
    selector: 'app-transport-route-ui',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule],
    templateUrl: './transport-route-ui.component.html',
    styleUrls: ['./transport-route-ui.component.css']
})
export class TransportRouteUIComponent {
    @Input() route!: TransportRoute;
    @Output() onToggle = new EventEmitter<Pair<number, EntityType>>();

    isCardOpen: boolean = false;
    imageUrl: string = "";
    estimatedProgress: number = 0;
    timeToArrivalSeconds: number = 0;
    etaString: string = "";

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
                this.imageUrl = "assets/images/circle-solid.png"; 
        }        
    }

    toggleCard(): void {
        this.isCardOpen = !this.isCardOpen;
        this.onToggle.emit({ first: this.route.entityId || 0, second: this.route.entityType || EntityType.SUPPLIER_SHIPMENT });
    }

    computeMetrics(): void {
        if (!this.route) return;

        if (this.route.departureDateTime && this.route.estimatedArrivalDateTime) {
            const totalDuration = this.route.estimatedArrivalDateTime.getTime() - this.route.departureDateTime.getTime();
            const elapsedDuration = new Date().getTime() - this.route.departureDateTime.getTime();
            this.estimatedProgress = elapsedDuration / totalDuration;
        }

        if (this.route.estimatedArrivalDateTime) {
            const estimatedArrivalDateTime = new Date(this.route.estimatedArrivalDateTime);
            this.timeToArrivalSeconds = (estimatedArrivalDateTime.getTime() - new Date().getTime()) / 1000;
            this.updateETAString();
        }
    }

    updateETAString(): void {
        if (this.timeToArrivalSeconds <= 0) {
            this.etaString = "Arrived";
            return;
        }

        const hours = Math.floor(this.timeToArrivalSeconds / 3600);
        const minutes = Math.floor((this.timeToArrivalSeconds % 3600) / 60);
        const seconds = Math.floor(this.timeToArrivalSeconds % 60);

        this.etaString = `${hours}h ${minutes}m ${seconds}s`;
    }

    faXmark = faXmark;
}
