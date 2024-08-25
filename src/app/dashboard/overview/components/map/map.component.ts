import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    ComponentRef,
    EmbeddedViewRef,
    Inject,
    PLATFORM_ID,
    ViewContainerRef,
} from '@angular/core';
import { Facility, SupplyChainMap } from '../../types/supplyChainMapTypes';
import { SupplyChainMapService } from '../../services/supplychainmap.service';
import { UserService } from '../../../../core/auth/services/user.service';
import { FallbackManagerService } from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { Organization } from '../../../organization/models/organization';
import { FacilityCardComponent } from './cards/facility-card/facility-card.component';
import { TransportRouteUIComponent } from './transport-route-ui/transport-route-ui.component';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EntityType, TransportRoute } from '../../../goods/models/TransportRoute';

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [FontAwesomeModule, CommonModule],
    templateUrl: './map.component.html',
    styleUrl: './map.component.css',
})
export class MapComponent {
    private map: any;
    private L: any;

    isMapInitialized: boolean = false;
    private openCardComponentRef: Map<string, ComponentRef<FacilityCardComponent | TransportRouteUIComponent>> = new Map();
    private routePolylines: Map<string, L.Polyline> = new Map();

    private supplyChainMap: SupplyChainMap | undefined;
    private currentOrganization: Organization | undefined;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private viewContainerRef: ViewContainerRef,
        private supplyChainMapService: SupplyChainMapService,
        private fallbackManagerService: FallbackManagerService,
        private userService: UserService,
    ) {}

    loadMap(): void {
        this.loadData(false);
    }

    refreshMap(): void {
        this.loadData(true);
    }

    private async loadData(refresh: boolean): Promise<void> {
        this.userService
            .getCurrentUser()
            .subscribe({
                next: (user) => {
                    this.currentOrganization = user?.organization;
                    if (user && user.organization) {
                        this.fallbackManagerService.updateNoOrganization(false);

                        this.loadSupplyChainMap(this.currentOrganization?.id ?? 0, refresh);
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

    private async loadSupplyChainMap(organizationId: number, refresh: boolean): Promise<void> {
        this.fallbackManagerService.updateLoading(true);

        this.supplyChainMapService
            .getSupplyChainMapByOrganizationId(organizationId, refresh)
            .subscribe({
                next: async (supplyChainMap) => {
                    this.supplyChainMap = supplyChainMap;
                    this.fallbackManagerService.updateLoading(false);
                    
                    if (!this.isMapInitialized) {
                        this.isMapInitialized = true;
                        await this.initMap();
                    }
                    this.createMapElements();
                },
                error: (err: Error) => {
                    this.fallbackManagerService.updateError(err.message ?? '');
                    this.fallbackManagerService.updateLoading(false);
                },
            });
    }

    private async initMap(): Promise<void> {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

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

        this.map.on('click', (e: L.LeafletMouseEvent) => {
            const clickedLat = e.latlng.lat;
            const clickedLng = e.latlng.lng;
            console.log(
                `Latitude: ${clickedLat}, Longitude: ${clickedLng}`
            );
        });
    }

    private createMapElements(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        if (!this.supplyChainMap || !this.supplyChainMap.mapData) {
            console.error('Supply Chain Map data is not available.');
            return;
        }
    
        this.supplyChainMap.mapData.facilities.forEach((facility) => {
            this.createFacilityComponent(facility);
        });

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
    
        componentRef.instance.onToggle.subscribe(({ first, second }) => {
            const facilityKey = `${first}-${second}`;

            // Manage other cards
            this.openCardComponentRef.forEach((value, key) => {
                if (key !== facilityKey && value.instance.isCardOpen) {
                    value.instance.toggleCard(); 
                }
            });

            // Update the reference map
            if (componentRef.instance.isCardOpen) {
                this.openCardComponentRef.set(facilityKey, componentRef);
            } else {
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
        this.createRoutePolyline(route, (componentRef));
        
        this.createRouteMarker(route, (componentRef));

        this.addArrowheads(route, 5);
    }
    
    private createRoutePolyline(route: TransportRoute, componentRef: ComponentRef<TransportRouteUIComponent>): void {
        const srcLatLng: [number, number] = [route.srcLocation?.first ?? 0, route?.srcLocation?.second ?? 0];
        const destLatLng: [number, number] = [route.destLocation?.first ?? 0, route?.destLocation?.second ?? 0];

        const polyline = this.L.polyline([srcLatLng, destLatLng], {
            color: route.entityType === EntityType.SUPPLIER_SHIPMENT ? 'blue' : 'green', 
            weight: 3
        }).addTo(this.map);

        const routeKey = `${route.entityId}-${route.entityType}`;
        this.routePolylines.set(routeKey, polyline);

        componentRef.instance.onToggle.subscribe(event => {
            if (componentRef.instance.isCardOpen) {
                polyline.setStyle({ weight: 6 });
            } else {
                polyline.setStyle({ weight: 3 });
            }
        });
    }

    private createRouteMarker(route: TransportRoute, componentRef: ComponentRef<TransportRouteUIComponent>): void {
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;

        // Create a Leaflet marker with the component's element
        let lat = 0;
        let lng = 0;
        const midPointLat = ((route.srcLocation?.first ?? 0) + (route.destLocation?.first ?? 0)) / 2;
        const midPointLng = ((route.srcLocation?.second ?? 0) + (route.destLocation?.second ?? 0)) / 2;
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

        componentRef.instance.onToggle.subscribe(({ first, second }) => {
            const routeKey = `${first}-${second}`;

            // Manage other cards
            this.openCardComponentRef.forEach((value, key) => {
                if (key !== routeKey && value.instance.isCardOpen) {
                    value.instance.toggleCard(); 
                }
            });

            // Update the reference map
            if (componentRef.instance.isCardOpen) {
                this.openCardComponentRef.set(routeKey, componentRef);
            } else {
                this.openCardComponentRef.delete(routeKey);
            }
        });

        // Add the marker to the map
        marker.addTo(this.map);
    }
    
    private addArrowheads(route: TransportRoute, n: number): void {
        // Calculate the geographical midpoints for arrows
        const start: [number, number] = [route.srcLocation?.first ?? 0, route?.srcLocation?.second ?? 0];
        const end: [number, number] = [route.destLocation?.first ?? 0, route?.destLocation?.second ?? 0];

        const arrowPoints = this.calculateIntermediatePoints(start, end, n);
        
        // Calculate the bearing for each segment
        arrowPoints.forEach((point, index) => {
            const angle = this.calculateBearing(
                index === 0 ? start : arrowPoints[index - 1],
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

    faArrowRotateRight = faArrowRotateRight;
}
