import { isPlatformBrowser } from '@angular/common';
import {
    AfterViewInit,
    Component,
    EmbeddedViewRef,
    Inject,
    PLATFORM_ID,
    ViewContainerRef,
} from '@angular/core';
import { Facility, SupplyChainMap } from '../../types/supplyChainMap';
import { SupplyChainMapService } from '../../services/supplychainmap.service';
import { UserService } from '../../../../core/auth/services/user.service';
import { FallbackManagerService } from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { Organization } from '../../../organization/models/organization';
import { FacilityCardComponent } from './cards/facility-card/facility-card.component';

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [],
    templateUrl: './map.component.html',
    styleUrl: './map.component.css',
})
export class MapComponent implements AfterViewInit {
    private map: any;
    private L: any;

    private supplyChainMap: SupplyChainMap | undefined;
    private currentOrganization: Organization | undefined;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private viewContainerRef: ViewContainerRef,
        private supplyChainMapService: SupplyChainMapService,
        private fallbackManagerService: FallbackManagerService,
        private userService: UserService
    ) {}

    
    ngAfterViewInit(): void {
        this.loadData();
    }

    private async loadData(): Promise<void> {
        this.userService
            .getCurrentUser()
            .subscribe({
                next: (user) => {
                    console.log('Current User:', user);
                    this.currentOrganization = user?.organization;
                    if (user && user.organization) {
                        this.fallbackManagerService.updateNoOrganization(false);

                        this.loadSupplyChainMap(this.currentOrganization?.id ?? 0);
                    } else {
                        this.fallbackManagerService.updateNoOrganization(true);
                        this.fallbackManagerService.updateLoading(false);
                    }
                },
                error: (error: Error) => {
                    this.fallbackManagerService.updateError(
                        error.message ?? ''
                    );
                    this.fallbackManagerService.updateLoading(false);
                },
            });
    }

    private loadSupplyChainMap(organizationId: number) {
        this.fallbackManagerService.updateLoading(true);

        this.supplyChainMapService
            .getSupplyChainMapByOrganizationId(organizationId)
            .subscribe({
                next: (supplyChainMap) => {
                    this.supplyChainMap = supplyChainMap;
                    this.fallbackManagerService.updateLoading(false);
                    
                    this.initMap();
                },
                error: (err: Error) => {
                    this.fallbackManagerService.updateError(err.message ?? '');
                    this.fallbackManagerService.updateLoading(false);
                },
            });
    }
    

    private async initMap(): Promise<void> {
        if (isPlatformBrowser(this.platformId)) {
            // Import leaflet and load map
            this.L = await import('leaflet');
            this.map = this.L.map('map', {
                center: [39.8282, -98.5795],
                zoom: 5,
                worldCopyJump: true,
            });

            // Load tiles
            const tiles = this.L.tileLayer(
                'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                {
                    maxZoom: 18,
                    minZoom: 3,
                    attribution:
                        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                }
            );

            tiles.addTo(this.map);

            // Create map elements
            this.createMapElements();

            this.map.on('click', (e: L.LeafletMouseEvent) => {
                const clickedLat = e.latlng.lat;
                const clickedLng = e.latlng.lng;
                console.log(
                    `Latitude: ${clickedLat}, Longitude: ${clickedLng}`
                );
            });
        }
    }

    private createMapElements(): void {
        if (!this.supplyChainMap || !this.supplyChainMap.mapData) {
            console.error('Supply Chain Map data is not available.');
            return;
        }
    
        // Create markers for each facility
        this.supplyChainMap.mapData.facilities.forEach((facility) => {
            this.createFacilityMarker(facility);
        });
    
        // Create a simple direct line for each transport route
        this.supplyChainMap.mapData.transportRoutes.forEach((route) => {
            // Ensure both source and destination locations are available
            if (route.srcLocation && route.destLocation) {
                // Extract LatLng tuples from source and destination locations
                const srcLatLng: L.LatLngTuple = [route.srcLocation.first, route.srcLocation.second];
                const destLatLng: L.LatLngTuple = [route.destLocation.first, route.destLocation.second];
    
                // Create a polyline directly from source to destination and add it to the map
                const routeOverlay = this.L.polyline([srcLatLng, destLatLng], {
                    color: 'blue',  // Customize the line color as needed
                }).addTo(this.map);
            } else {
                console.warn('Missing location data for route:', route);
            }
        });
    }
    
    
    
    private createFacilityMarker(facilityData: Facility): void {
        if (!this.L) {
            console.error('Leaflet (L) is not available.');
            return;
        }

        // Dynamically create the FactoryCardComponent
        const componentRef =
            this.viewContainerRef.createComponent(FacilityCardComponent);
            
        // Set the facility input on the component instance
        componentRef.instance.facility = facilityData;
        componentRef.instance.initializeData(); // Trigger changes to update facility icon image
        
        // Access the DOM element of the component
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;

        // Create a Leaflet marker with the component's element
        const marker = this.L.marker(
            [facilityData.latitude, facilityData.longitude],
            {
                icon: this.L.divIcon({
                    html: domElem,
                    className: 'flex justify-center',
                    iconSize: [30, 30],
                }),
            }
        );

        // Add the marker to the map
        marker.addTo(this.map);
    }

}
