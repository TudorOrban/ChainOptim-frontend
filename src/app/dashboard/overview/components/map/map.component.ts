import { isPlatformBrowser } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ComponentRef,
    EmbeddedViewRef,
    Inject,
    PLATFORM_ID,
    ViewContainerRef,
} from '@angular/core';
import { Facility, FacilityType, SupplyChainMap, TransportRoute } from '../../types/supplyChainMapTypes';
import { SupplyChainMapService } from '../../services/supplychainmap.service';
import { UserService } from '../../../../core/auth/services/user.service';
import { FallbackManagerService } from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { Organization } from '../../../organization/models/organization';
import { FacilityCardComponent } from './cards/facility-card/facility-card.component';
import { TransportRouteUIComponent } from './transport-route-ui/transport-route-ui.component';
import { LeafletMouseEvent } from 'leaflet';

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [],
    templateUrl: './map.component.html',
    styleUrl: './map.component.css',
})
export class MapComponent {
    private map: any;
    private L: any;

    private openCardComponentRef: Map<string, ComponentRef<FacilityCardComponent>> = new Map();

    private supplyChainMap: SupplyChainMap | undefined;
    private currentOrganization: Organization | undefined;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private viewContainerRef: ViewContainerRef,
        private supplyChainMapService: SupplyChainMapService,
        private fallbackManagerService: FallbackManagerService,
        private userService: UserService
    ) {}

    
    // ngAfterViewInit(): void {
    //     this.loadData();
    // }

    loadMap(): void {
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
                console.log('Map clicked');
                this.openCardComponentRef.forEach((value, key) => {
                    if (value.instance.isCardOpen) {
                        console.log(`Closing card from map click: ${key}`);
                        value.instance.toggleCard();
                        this.openCardComponentRef.delete(key);
                    }
                });
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
            this.createFacilityComponent(facility);
        });

        // Create a simple direct line for each transport route
        this.supplyChainMap.mapData.transportRoutes.forEach(route => {
            this.createRouteComponent(route);
          });
    }
    private createFacilityComponent(facilityData: Facility): void {
        if (!this.L) {
            console.error('Leaflet (L) is not available.');
            return;
        }
    
        const componentRef = this.viewContainerRef.createComponent(FacilityCardComponent);
        componentRef.instance.facility = facilityData;
        componentRef.instance.initializeData(); 
    
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    
        const marker = this.L.marker([facilityData.latitude, facilityData.longitude], {
            icon: this.L.divIcon({
                html: domElem,
                className: 'flex justify-center',
                iconSize: [30, 30],
            }),
        });
    
        marker.on('click', (event: LeafletMouseEvent) => {
            console.log('Marker clicked');
            this.L.DomEvent.stopPropagation(event);  // Prevent the event from bubbling up to the map
    
            const facilityKey = this.getFacilityKey(facilityData);
            console.log(`Marker clicked, facilityKey: ${facilityKey}`);
    
            const currentOpenRef = this.openCardComponentRef.get(facilityKey);
            console.log(`Current open card reference: ${currentOpenRef ? 'Exists' : 'Does not exist'}`);
    
            // Close any currently open card that is not the one being clicked
            this.openCardComponentRef.forEach((value, key) => {
                if (key !== facilityKey && value.instance.isCardOpen) {
                    console.log(`Closing card: ${key}`);
                    value.instance.toggleCard();
                    this.openCardComponentRef.delete(key);
                }
            });
    
            // Toggle the clicked card
            if (!currentOpenRef || !currentOpenRef.instance.isCardOpen) {
                console.log(`Toggling card open: ${facilityKey}`);
                componentRef.instance.toggleCard();
                this.openCardComponentRef.set(facilityKey, componentRef);
            } else {
                console.log(`Toggling card closed: ${facilityKey}`);
                this.openCardComponentRef.delete(facilityKey);
            }
        });
    
        marker.addTo(this.map);
    }
    
    

    private createRouteComponent(route: TransportRoute): void {
        if (route.srcLocation && route.destLocation) {
            const componentRef =
            this.viewContainerRef.createComponent(TransportRouteUIComponent);
            
            componentRef.instance.route = route;
            componentRef.instance.initializeData();
            this.drawRoute(route, componentRef);
        } else {
            console.warn('Missing location data for route:', route);
        }
    }
    
    private drawRoute(route: TransportRoute, componentRef: ComponentRef<TransportRouteUIComponent>): void {
        const srcLatLng: [number, number] = [route.srcLocation.first, route.srcLocation.second];
        const destLatLng: [number, number] = [route.destLocation.first, route.destLocation.second];

        const polyline = this.L.polyline([srcLatLng, destLatLng], {
            color: 'blue', 
            weight: 3
        }).addTo(this.map);

        this.createRouteMarker(route, (componentRef.hostView as EmbeddedViewRef<any>));

        this.addArrowheads(srcLatLng, destLatLng, 5);
    }
    
    private createRouteMarker(route: TransportRoute, hostView: EmbeddedViewRef<any>): void {
        const domElem = hostView
            .rootNodes[0] as HTMLElement;

            let lat = 0;
            let lng = 0;
            // Create a Leaflet marker with the component's element
            const midPointLat = (route.srcLocation.first + route.destLocation.first) / 2;
            const midPointLng = (route.srcLocation.second + route.destLocation.second) / 2;
            
            if (route.liveLocation && route.liveLocation.first && route.liveLocation.second) {
                lat = route.liveLocation.first;
                lng = route.liveLocation.second;
            } else {
                lat = midPointLat;
                lng = midPointLng;
            }

            const marker = this.L.marker(
                [lat, lng],
                {
                    icon: this.L.divIcon({
                        html: domElem,
                        className: 'flex justify-center',
                        iconSize: [25, 25],
                    }),
                }
            );

            // Add the marker to the map
            marker.addTo(this.map);
    }
    
    private addArrowheads(start: [number, number], end: [number, number], n: number): void {
        // Calculate the geographical midpoints for arrows
        const arrowPoints = this.calculateIntermediatePoints(start, end, n);
        
        // Calculate the bearing for each segment
        arrowPoints.forEach((point, index) => {
            const angle = this.calculateBearing(
                index === 0 ? start : arrowPoints[index - 1], // Previous point
                point
            );
            const offset = 38;
            const adjustedAngle = (angle + offset) % 360;

            // Create an arrow marker
            const arrowIcon = this.L.divIcon({
                className: 'arrow-icon',
                html: `<div style="transform: rotate(${adjustedAngle}deg); width: 8px; height: 8px; border-left: 3px solid black; border-top: 3px solid black;"></div>`,
                iconSize: [10, 10]
            });

            // Add the marker at the calculated point
            this.L.marker(point, { icon: arrowIcon }).addTo(this.map);
        });
    }

    private calculateIntermediatePoints(start: [number, number], end: [number, number], n: number): [number, number][] {
        const points: [number, number][] = [];

        // Calculate step increments
        const stepLat = (end[0] - start[0]) / (n + 1);
        const stepLng = (end[1] - start[1]) / (n + 1);

        // Calculate intermediate points
        for (let i = 1; i <= n; i++) {
            const lat = start[0] + stepLat * i;
            const lng = start[1] + stepLng * i;
            points.push([lat, lng]);
        }

        return points;
    }

    private calculateBearing(start: [number, number], end: [number, number]): number {
        const startLat = this.deg2rad(start[0]);
        const startLng = this.deg2rad(start[1]);
        const endLat = this.deg2rad(end[0]);
        const endLng = this.deg2rad(end[1]);
    
        const y = Math.sin(endLng - startLng) * Math.cos(endLat);
        const x = Math.cos(startLat) * Math.sin(endLat) -
                  Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
    
        const brng = Math.atan2(y, x);
        return (this.rad2deg(brng) + 360) % 360;  // Convert to degrees and ensure it's positive
    }
    
    private deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }
    
    private rad2deg(rad: number): number {
        return rad * (180 / Math.PI);
    }

    private getFacilityKey(facilityData: Facility): string {
        return `${facilityData.id}-${facilityData.type}`;
    }
}
