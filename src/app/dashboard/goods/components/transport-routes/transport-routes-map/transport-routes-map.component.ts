import { AfterViewChecked, ChangeDetectorRef, Component, ComponentRef, EmbeddedViewRef, Inject, OnInit, PLATFORM_ID, ViewChild, ViewContainerRef } from '@angular/core';
import { FacilityCardComponent } from '../../../../overview/components/map/cards/facility-card/facility-card.component';
import { TransportRouteUIComponent } from '../../../../overview/components/map/transport-route-ui/transport-route-ui.component';
import { SupplyChainMapService } from '../../../../overview/services/supplychainmap.service';
import { FallbackManagerService } from '../../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { UserService } from '../../../../../core/auth/services/user.service';
import { Organization } from '../../../../organization/models/organization';
import { EntityType, Pair, ResourceTransportRoute } from '../../../models/TransportRoute';
import { TransportRouteService } from '../../../services/transportroute.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Facility, FacilityType, SupplyChainMap } from '../../../../overview/types/supplyChainMapTypes';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRotateRight, faEdit, faLocationPin, faPlus } from '@fortawesome/free-solid-svg-icons';
import { AddTransportRouteComponent } from './add-transport-route/add-transport-route.component';
import { RouteDetailsComponent } from './route-details/route-details.component';
import { LeafletEvent, LeafletMouseEvent } from 'leaflet';
import { UpdateTransportRouteComponent } from './update-transport-route/update-transport-route.component';

@Component({
  selector: 'app-transport-routes-map',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, AddTransportRouteComponent, RouteDetailsComponent, UpdateTransportRouteComponent],
  templateUrl: './transport-routes-map.component.html',
  styleUrl: './transport-routes-map.component.css'
})
export class TransportRoutesMapComponent implements OnInit, AfterViewChecked {
    @ViewChild(AddTransportRouteComponent) addRouteComponent!: AddTransportRouteComponent;
    @ViewChild(UpdateTransportRouteComponent) updateRouteComponent!: UpdateTransportRouteComponent;

    private map: any;
    private L: any;

    isMapInitialized: boolean = false;
    private openCardComponentRef: Map<string, ComponentRef<FacilityCardComponent | TransportRouteUIComponent>> = new Map();
    private routePolylines: Map<string, L.Polyline> = new Map(); // Key: route ID
    
    supplyChainMap: SupplyChainMap | undefined;
    private routes: ResourceTransportRoute[] = [];
    private currentOrganization: Organization | undefined;

    selectedRoute: ResourceTransportRoute | undefined;
    
    // Add Route state
    isAddRouteModeOn: boolean = false;
    isUpdateRouteModeOn: boolean = false;
    private addRouteListenersSetUp: boolean = false;
    private updateRouteListenersSetUp: boolean = false;

    // - Src and Dest location selection
    private isSelectSrcDestLocationModeOn: boolean = false;
    private areSrcDestLocationsConfirmed: boolean = false;
    private temporaryPins: any[] = [];
    private temporaryRoutes: any[] = [];

    // - Current location selection
    private isSelectCurrentLocationModeOn: boolean = false;
    private isCurrentLocationConfirmed: boolean = false;
    private currentLocationTemporaryPin: any;

    faArrowRotateRight = faArrowRotateRight;
    faPlus = faPlus;
    faEdit = faEdit;
    faLocationPin = faLocationPin;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private viewContainerRef: ViewContainerRef,
        private transportRouteService: TransportRouteService,
        private supplyChainMapService: SupplyChainMapService,
        private fallbackManagerService: FallbackManagerService,
        private userService: UserService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.loadData(false);
    }
        
    ngAfterViewChecked(): void {
        if (this.addRouteComponent && !this.addRouteListenersSetUp) {
            console.log('Setting up add route listeners:', this.updateRouteComponent);
            this.setUpAddRouteListeners();
            this.addRouteListenersSetUp = true;  
        }
    }

    private async loadData(refresh: boolean): Promise<void> {
        this.fallbackManagerService.updateLoading(true);

        this.userService
            .getCurrentUser()
            .subscribe({
                next: (user) => {
                    this.currentOrganization = user?.organization;
                    if (user?.organization) {
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
        this.supplyChainMapService
            .getSupplyChainMapByOrganizationId(organizationId, refresh)
            .subscribe({
                next: async (supplyChainMap) => {
                    console.log('Supply Chain Map:', supplyChainMap);
                    this.supplyChainMap = supplyChainMap;
                    
                    this.loadRoutes(organizationId);
                },
                error: (err: Error) => {
                    this.fallbackManagerService.updateError(err.message ?? '');
                    this.fallbackManagerService.updateLoading(false);
                },
            });
    }

    private async loadRoutes(organizationId: number): Promise<void> {
        this.fallbackManagerService.updateLoading(true);

        this.transportRouteService
            .getResourceTransportRoutesByOrganizationId(organizationId)
            .subscribe({
                next: async (routes) => {
                    this.routes = routes;
                    console.log('Routes:', this.routes);
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

        // Import Leaflet dynamically to avoid issue with SSR
        this.L = await import('leaflet');
        
        // Load map and tiles
        this.map = this.L.map('map', {
            center: [39.8282, -98.5795],
            zoom: 5,
            worldCopyJump: true,
        });

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

        this.map.on('click', (e: L.LeafletMouseEvent) => this.handleMapClick(e));
    }
    
    // Map rendering
    private createMapElements(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        if (!this.routes || !this.supplyChainMap) {
            console.error('Supply Chain Map data is not available.');
            return;
        }
    
        this.supplyChainMap.mapData.facilities.forEach((facility) => {
            this.createFacilityComponent(facility);
        });

        this.routes.forEach(route => {
            this.createRouteComponent(route);
        });

        this.setUpListeners();
    }
    
    // - Facility component
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
            this.handleToggleFacilityComponentCard(componentRef, first, second);
        });

        marker.addTo(this.map);
    }

    private handleToggleFacilityComponentCard(componentRef: ComponentRef<FacilityCardComponent>, id: number, type: FacilityType): void {
        const facilityKey = `${id}-${type}`;

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
    }
    
    // - Route component
    private createRouteComponent(route: ResourceTransportRoute): void {
        if (route.transportRoute.srcLocation && route.transportRoute.destLocation) {
            const componentRef =
                this.viewContainerRef.createComponent(TransportRouteUIComponent);
            
            componentRef.instance.route = route.transportRoute;
            componentRef.instance.initializeData();
            
            this.drawRoute(route, componentRef);
        } else {
            console.warn('Missing location data for route:', route);
        }
    }
    
    private drawRoute(route: ResourceTransportRoute, componentRef: ComponentRef<TransportRouteUIComponent>): void {
        this.createRoutePolyline(route, (componentRef));
        
        this.createRouteMarker((componentRef), route.transportRoute.srcLocation, route.transportRoute.destLocation, route.transportRoute.liveLocation);

        this.addArrowheads(5, route.transportRoute.srcLocation, route.transportRoute.destLocation);
    }
    
    private createRoutePolyline(route: ResourceTransportRoute, componentRef: ComponentRef<TransportRouteUIComponent>): void {
        const srcLatLng: [number, number] = [route.transportRoute.srcLocation?.first ?? 0, route?.transportRoute.srcLocation?.second ?? 0];
        const destLatLng: [number, number] = [route.transportRoute.destLocation?.first ?? 0, route?.transportRoute.destLocation?.second ?? 0];

        const polyline = this.L.polyline([srcLatLng, destLatLng], {
            color: route.transportRoute.entityType === EntityType.SUPPLIER_SHIPMENT ? 'blue' : 'green', 
            weight: 3
        }).addTo(this.map);

        const routeKey = `${route.transportRoute.entityId}-${route.transportRoute.entityType}`;
        this.routePolylines.set(routeKey, polyline);

        componentRef.instance.onToggle.subscribe(event => {
            if (componentRef.instance.isCardOpen) {
                polyline.setStyle({ weight: 6 });
            } else {
                polyline.setStyle({ weight: 3 });
            }
        });
        
        this.addHoverAndSelectEffect(route, componentRef, polyline);
    }

    private addHoverAndSelectEffect(route: ResourceTransportRoute, componentRef: ComponentRef<TransportRouteUIComponent>, polyline: L.Polyline): void {
        polyline.on('mouseover', (e: LeafletEvent) => {
            polyline.setStyle({ weight: this.getRouteLineWeight(route, componentRef, true) });
        });    
        polyline.on('mouseout', (e: LeafletEvent) => {
            polyline.setStyle({ weight: this.getRouteLineWeight(route, componentRef, false) });
        });
        polyline.on('click', (e: LeafletMouseEvent) => {
            e.originalEvent.stopPropagation(); 
            polyline.setStyle({ color: 'red', weight: this.getRouteLineWeight(route, componentRef, false) });
            this.map.fitBounds(polyline.getBounds());
            this.selectedRoute = route;
        });
    }

    private getRouteLineWeight(route: ResourceTransportRoute, componentRef: ComponentRef<TransportRouteUIComponent>, isHovering: boolean): number {
        let weight = 3;
        if (componentRef.instance.isCardOpen) {
            weight = 5;
        } else if (this.selectedRoute?.id === route.id) {
            weight = 6;
        } else if (isHovering) {
            weight = 5;
        }
        return weight;
    }

    private deselectRoute(): void {
        console.log('Deselecting route');
        if (this.selectedRoute?.id && this.routePolylines.has(`${this.selectedRoute.transportRoute.entityId}-${this.selectedRoute.transportRoute.entityType}`)) {
            const polyline = this.routePolylines.get(`${this.selectedRoute.transportRoute.entityId}-${this.selectedRoute.transportRoute.entityType}`);
            console.log('Polyline:', polyline);
            polyline?.setStyle({ weight: 3, color: 'green' });
        }
        this.selectedRoute = undefined;
    }

    private createRouteMarker(componentRef: ComponentRef<TransportRouteUIComponent>, srcLocation?: Pair<number, number>, destLocation?: Pair<number, number>, liveLocation?: Pair<number, number>): void {
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;

        // Create a Leaflet marker with the component's element
        const [lat, lng] = this.computeMarkerLatLng(srcLocation, destLocation, liveLocation);

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
            this.handleToggleRouteCard(componentRef, first, second);
        });

        // Add the marker to the map
        marker.addTo(this.map);
    }

    private computeMarkerLatLng(srcLocation?: Pair<number, number>, destLocation?: Pair<number, number>, liveLocation?: Pair<number, number>): [number, number] {
        let lat = 0;
        let lng = 0;
        const midPointLat = ((srcLocation?.first ?? 0) + (destLocation?.first ?? 0)) / 2;
        const midPointLng = ((srcLocation?.second ?? 0) + (destLocation?.second ?? 0)) / 2;
        if (liveLocation?.first && liveLocation?.second) {
            lat = liveLocation.first;
            lng = liveLocation.second;
        } else {
            lat = midPointLat;
            lng = midPointLng;
        }

        return [lat, lng];
    }

    private handleToggleRouteCard(componentRef: ComponentRef<TransportRouteUIComponent>, id: number, type: EntityType): void {
        const routeKey = `${id}-${type}`;

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
    }
    
    private addArrowheads(n: number, srcLocation?: Pair<number, number>, destLocation?: Pair<number, number>): void {
        if (!srcLocation || !destLocation) return;

        // Calculate the geographical midpoints for arrows
        const start: [number, number] = [srcLocation?.first ?? 0, srcLocation?.second ?? 0];
        const end: [number, number] = [destLocation?.first ?? 0, destLocation?.second ?? 0];

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

    // Location selection
    // - Map click handler
    private handleMapClick(e: L.LeafletMouseEvent): void {
        const clickedLat = e.latlng.lat;
        const clickedLng = e.latlng.lng;
        console.log(
            `Latitude: ${clickedLat}, Longitude: ${clickedLng}`
        );
        
        // this.deselectRoute();
        this.informAddRouteComponentOnLocationClicked(clickedLat, clickedLng);
        this.informUpdateRouteComponentOnLocationClicked(clickedLat, clickedLng);
           
        if (this.isSelectSrcDestLocationModeOn) {
            this.addLocationPin(clickedLat, clickedLng, true, false);
        }
        if (this.isSelectCurrentLocationModeOn) {
            this.addLocationPin(clickedLat, clickedLng, true, true);
        }
    }

    private informAddRouteComponentOnLocationClicked(clickedLat: number, clickedLng: number): void {
        if (!this.isAddRouteModeOn) {
            return;
        }
        if (!this.addRouteComponent) {
            console.error('Add route component is not available.');
            return;
        }

        this.addRouteComponent.onLocationClicked({ first: clickedLat, second: clickedLng });
    }

    private informUpdateRouteComponentOnLocationClicked(clickedLat: number, clickedLng: number): void {
        if (!this.isUpdateRouteModeOn) {
            return;
        }
        if (!this.updateRouteComponent) {
            console.error('Update route component is not available.');
            return;
        }

        this.updateRouteComponent.onLocationClicked({ first: clickedLat, second: clickedLng });
    }

    private addLocationPin(clickedLat: number, clickedLng: number, temporary: boolean, isCurrentLocation: boolean): void {
        const iconHtml = `<i class="fas fa-map-pin" style="color: red; font-size: 24px;"></i>`;

        const customIcon = this.L.divIcon({
            html: iconHtml,
            iconSize: this.L.point(30, 30),
            iconAnchor: this.L.point(15, 30)
        });

        const marker = this.L.marker([clickedLat, clickedLng], { icon: customIcon });
        marker.addTo(this.map);

        if (temporary) {
            if (this.temporaryPins.length == 2) {
                this.temporaryPins?.[0]?.remove();
            }
            this.temporaryPins.push(marker);
        }
        if (isCurrentLocation) {
            if (this.currentLocationTemporaryPin) {
                this.currentLocationTemporaryPin.remove();
            }
            this.currentLocationTemporaryPin = marker;
        }
    }

    // - Communication with Add Route component
    handleToggleAddRouteMode(): void {
        this.isAddRouteModeOn = !this.isAddRouteModeOn;
        this.deselectRoute();
    }
    
    
    handleToggleUpdateRouteMode(): void {
        this.isAddRouteModeOn = false;
        this.isUpdateRouteModeOn = !this.isUpdateRouteModeOn;
        this.cdr.detectChanges(); // Force change detection to update the view

        console.log('Update route mode:', this.isUpdateRouteModeOn);
        if (this.updateRouteComponent) {
            this.updateRouteComponent.onUpdateModeChanged(this.selectedRoute);
            this.setUpUpdateRouteListeners();
            this.updateRouteListenersSetUp = true;
        } else {
            console.error('Update route component is not available.');
        }
    }

    private setUpListeners(): void {
        this.setUpAddRouteListeners();
        this.setUpUpdateRouteListeners();
    }

    private setUpAddRouteListeners(): void {
        if (!this.addRouteComponent) {
            return;
        }

        // Src and Dest location selection
        this.addRouteComponent.onSelectLocationModeChanged.subscribe((on) => {
            this.isSelectSrcDestLocationModeOn = on;
            if (!this.areSrcDestLocationsConfirmed) {
                this.handleRemoveTemporaryPins(true);
                this.handleRemoveTemporaryRoutes();
            }
        });
        this.addRouteComponent.onDrawRoute.subscribe((locations) => {
            this.handleRemoveTemporaryPins(false);
            this.handleRemoveTemporaryRoutes();
            this.handleDrawRoute(locations, true);
        });
        this.addRouteComponent.onConfirmSelectedLocations.subscribe((locations) => {
            this.areSrcDestLocationsConfirmed = true;
        });
        this.addRouteComponent.onCancelSelectedLocations.subscribe(() => {
            this.handleRemoveTemporaryPins(true);
            this.handleRemoveTemporaryRoutes();
        })
        this.addRouteComponent.onCancelConfirmedLocations.subscribe(() => {
            this.areSrcDestLocationsConfirmed = false;
            this.handleRemoveTemporaryPins(true);
            this.handleRemoveTemporaryRoutes();
        });
        
        // Current location selection
        this.addRouteComponent.onSelectCurrentLocationModeChanged.subscribe((on) => {
            this.isSelectCurrentLocationModeOn = on;
        });
        this.addRouteComponent.onConfirmCurrentLocation.subscribe((location) => {
            this.isCurrentLocationConfirmed = true;
            this.handleRemoveCurrentLocationPin();
            this.addLocationPin(location.first, location.second, false, true);
        });
        this.addRouteComponent.onCancelCurrentLocation.subscribe(() => {
            this.isCurrentLocationConfirmed = false;
            this.handleRemoveCurrentLocationPin();
        });
        this.addRouteComponent.onCancelConfirmedCurrentLocation.subscribe(() => {
            this.isCurrentLocationConfirmed = false;
            this.handleRemoveCurrentLocationPin();
        });

        // Add route
        this.addRouteComponent.onRouteAdded.subscribe((route) => {
            this.handleAddRoute(route);
        });
    }

    private setUpUpdateRouteListeners(): void {
        if (!this.updateRouteComponent) {
            console.error('Update route component is not available.');
            return;
        }

        // Src and Dest location selection
        this.updateRouteComponent.onSelectLocationModeChanged.subscribe((on) => {
            console.log('Select location mode changed:', on);
            this.isSelectSrcDestLocationModeOn = on;
            if (!this.areSrcDestLocationsConfirmed) {
                this.handleRemoveTemporaryPins(true);
                this.handleRemoveTemporaryRoutes();
            }
        });
        this.updateRouteComponent.onDrawRoute.subscribe((locations) => {
            console.log('Draw route:', locations);
            this.handleRemoveTemporaryPins(false);
            this.handleRemoveTemporaryRoutes();
            this.handleDrawRoute(locations, true);
        });
        this.updateRouteComponent.onConfirmSelectedLocations.subscribe((locations) => {
            this.areSrcDestLocationsConfirmed = true;
        });
        this.updateRouteComponent.onCancelSelectedLocations.subscribe(() => {
            this.handleRemoveTemporaryPins(true);
            this.handleRemoveTemporaryRoutes();
        })
        this.updateRouteComponent.onCancelConfirmedLocations.subscribe(() => {
            this.areSrcDestLocationsConfirmed = false;
            this.handleRemoveTemporaryPins(true);
            this.handleRemoveTemporaryRoutes();
        });
        
        // Current location selection
        this.updateRouteComponent.onSelectCurrentLocationModeChanged.subscribe((on) => {
            this.isSelectCurrentLocationModeOn = on;
        });
        this.updateRouteComponent.onConfirmCurrentLocation.subscribe((location) => {
            this.isCurrentLocationConfirmed = true;
            this.handleRemoveCurrentLocationPin();
            this.addLocationPin(location.first, location.second, false, true);
        });
        this.updateRouteComponent.onCancelCurrentLocation.subscribe(() => {
            this.isCurrentLocationConfirmed = false;
            this.handleRemoveCurrentLocationPin();
        });
        this.updateRouteComponent.onCancelConfirmedCurrentLocation.subscribe(() => {
            this.isCurrentLocationConfirmed = false;
            this.handleRemoveCurrentLocationPin();
        });

        // Update route
        this.updateRouteComponent.onRouteUpdated.subscribe((route) => {
            this.handleUpdateRoute(route);
        });
    }

    private handleDrawRoute(locations: Pair<number, number>[], isTemporary: boolean): void {
        const srcLatLng: [number, number] = [locations[0]?.first ?? 0, locations[0]?.second ?? 0];
        const destLatLng: [number, number] = [locations[1]?.first ?? 0, locations[1]?.second ?? 0];

        const polyline = this.L.polyline([srcLatLng, destLatLng], {
            color: 'blue', 
            weight: 3
        }).addTo(this.map);

        if (isTemporary) {
            this.temporaryRoutes.push(polyline);
        }
    }
    
    private handleAddRoute(route: ResourceTransportRoute): void {
        this.routes.push(route);
        this.createRouteComponent(route);
        this.handleRemoveTemporaryPins(true);
        this.handleRemoveTemporaryRoutes();
        this.handleRemoveCurrentLocationPin();
        this.areSrcDestLocationsConfirmed = false;
        this.isCurrentLocationConfirmed = false;
        this.isSelectSrcDestLocationModeOn = false;
        this.isSelectCurrentLocationModeOn = false;
        this.isAddRouteModeOn = false;
    }

    private handleUpdateRoute(route: ResourceTransportRoute): void {
        this.handleRemoveTemporaryPins(true);
        this.handleRemoveTemporaryRoutes();
        this.handleRemoveCurrentLocationPin();
        this.areSrcDestLocationsConfirmed = false;
        this.isCurrentLocationConfirmed = false;
        this.isSelectSrcDestLocationModeOn = false;
        this.isSelectCurrentLocationModeOn = false;
        this.isUpdateRouteModeOn = false;

        // Remove and recreate the route component
        const routeIndex = this.routes.findIndex(r => r.id === route.id);
        if (routeIndex === -1) {
            console.error('Route not found:', route);
            return;
        }
        this.routes[routeIndex] = route;

        const routeKey = `${route.transportRoute.entityId}-${route.transportRoute.entityType}`;
        const polyline = this.routePolylines.get(routeKey);
        polyline?.remove();
        this.routePolylines.delete(routeKey);

        this.createRouteComponent(route);
    }
    
    
    private handleRemoveTemporaryPins(all: boolean): void {
        if (all) {
            this.temporaryPins.forEach(pin => {
                pin.remove();
            });
            this.temporaryPins = [];
        } else {
            while (this.temporaryPins.length > 2) {
                const pinToRemove = this.temporaryPins.shift();
                pinToRemove.remove();
            }
        }
    }

    private handleRemoveCurrentLocationPin(): void {
        if (this.currentLocationTemporaryPin) {
            this.currentLocationTemporaryPin.remove();
        }
    }
    
    private handleRemoveTemporaryRoutes(): void {
        this.temporaryRoutes.forEach(polyline => {
            // Remove the polyline from the map
            polyline.remove();
        });
    
        this.temporaryRoutes = [];
    }
}
