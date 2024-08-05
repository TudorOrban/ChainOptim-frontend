import { Component, Input, OnDestroy, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { TransportRoute, TransportType } from '../../../types/supplyChainMapTypes';
import { isPlatformBrowser } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-transport-route-ui',
  standalone: true,
  imports: [],
  templateUrl: './transport-route-ui.component.html',
  styleUrl: './transport-route-ui.component.css'
})
export class TransportRouteUIComponent implements OnInit, OnDestroy {
    @Input() route!: TransportRoute;
    @Input() map!: L.Map;
    private polyline?: L.Polyline;

    isSelected: boolean = false;
    imageUrl: string = "";
    
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            // Only run Leaflet code on the client side
            this.initializeData();
        }
    }

    public initializeData(): void {
        this.updateImageUrl();
        this.drawRoute();
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

    drawRoute(): void {
        if (!this.map || !this.route) return;

        const srcLatLng: L.LatLngTuple = [this.route.srcLocation.first, this.route.srcLocation.second];
        const destLatLng: L.LatLngTuple = [this.route.destLocation.first, this.route.destLocation.second];

        // Create and style the polyline
        this.polyline = L.polyline([srcLatLng, destLatLng], {
            color: 'blue', // Default color
            weight: 5
        }).addTo(this.map);

        // Add click handler to change color or show details
        this.polyline.on('click', () => {
            this.toggleSelection();
        });
    }

    toggleSelection(): void {
        if (this.polyline) {
            this.polyline.setStyle({ color: this.isSelected ? 'red' : 'blue' });
            this.isSelected = !this.isSelected;
        }
    }

    ngOnDestroy(): void {
        if (this.polyline) {
            this.polyline.remove();  // Clean up the polyline when the component is destroyed
        }
    }

}
