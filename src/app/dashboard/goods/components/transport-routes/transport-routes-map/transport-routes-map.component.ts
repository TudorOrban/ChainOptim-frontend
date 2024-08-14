import { Component, ComponentRef, Inject, OnInit, PLATFORM_ID, ViewContainerRef } from '@angular/core';
import { FacilityCardComponent } from '../../../../overview/components/map/cards/facility-card/facility-card.component';
import { TransportRouteUIComponent } from '../../../../overview/components/map/transport-route-ui/transport-route-ui.component';
import { SupplyChainMapService } from '../../../../overview/services/supplychainmap.service';
import { FallbackManagerService } from '../../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { UserService } from '../../../../../core/auth/services/user.service';
import { Organization } from '../../../../organization/models/organization';
import { ResourceTransportRoute, TransportRoute } from '../../../models/TransportRoute';
import { TransportRouteService } from '../../../services/transportroute.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SupplyChainMap } from '../../../../overview/types/supplyChainMapTypes';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRotateRight, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-transport-routes-map',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './transport-routes-map.component.html',
  styleUrl: './transport-routes-map.component.css'
})
export class TransportRoutesMapComponent implements OnInit {
    private map: any;
    private L: any;

    isMapInitialized: boolean = false;
    private openCardComponentRef: Map<string, ComponentRef<FacilityCardComponent | TransportRouteUIComponent>> = new Map();
    private routePolylines: Map<string, L.Polyline> = new Map();
    
    private supplyChainMap: SupplyChainMap | undefined;
    private routes: ResourceTransportRoute[] = [];
    private currentOrganization: Organization | undefined;
    
    faArrowRotateRight = faArrowRotateRight;
    faPlus = faPlus;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private viewContainerRef: ViewContainerRef,
        private transportRouteService: TransportRouteService,
        private supplyChainMapService: SupplyChainMapService,
        private fallbackManagerService: FallbackManagerService,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.loadData(false);
    }

    private async loadData(refresh: boolean): Promise<void> {
        this.fallbackManagerService.updateLoading(true);

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

        if (!this.routes || !this.routes) {
            console.error('Supply Chain Map data is not available.');
            return;
        }
    
        // this.routes.facilities.forEach((facility) => {
        //     this.createFacilityComponent(facility);
        // });

        // this.routes.transportRoutes.forEach(route => {
        //     this.createRouteComponent(route);
        //   });
    }

    handleCreateRoute(): void {
        console.log('Create Route');
    }
}
