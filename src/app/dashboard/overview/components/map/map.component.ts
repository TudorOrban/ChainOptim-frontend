import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [],
    templateUrl: './map.component.html',
    styleUrl: './map.component.css',
})
export class MapComponent implements AfterViewInit {
    private map: any;
    private MockData = {
        factories: [
            {
                id: 1,
                location: {
                    latitude: 39.8282,
                    longitude: -98.5795,
                },
            },
            {
                id: 2,
                location: {
                    latitude: 29.8282,
                    longitude: -71.5795,
                },
            },
            {
                id: 3,
                location: {
                    latitude: 91.8282,
                    longitude: 32.5795,
                },
            },
        ],
        warehouses: [
            {
                id: 1,
                location: {
                    latitude: 43.8282,
                    longitude: -92.5795,
                },
            },
            {
                id: 2,
                location: {
                    latitude: 37.8282,
                    longitude: -78.5795,
                },
            },
            {
                id: 3,
                location: {
                    latitude: 58.8282,
                    longitude: -60.5795,
                },
            },
        ],
        shipmentRoutes: [
            {
                id: 1,
                routeData: [
                    [39.8282, -98.5795],
                    [29.8282, -71.5795],
                ],
            },
            {
                id: 2,
                routeData: [
                    [39.8282, -98.5795],
                    [37.8282, -78.5795],
                ],
            },
        ],
        ships: [
            {
                id: 1,
                routeId: 1,
                currentLocation: {
                    latitude: 41.8282,
                    longitude: -98.5795,
                },
            },
            {
                id: 2,
                routeId: 2,
                currentLocation: {
                    latitude: 37.8282,
                    longitude: 88.5795,
                },
            },
        ],
        airplanes: [
            {
                id: 1,
                routeId: 1,
                currentLocation: {
                    latitude: 34.8282,
                    longitude: -85.5795,
                },
            },
        ],
    };

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    private async initMap(): Promise<void> {
        if (isPlatformBrowser(this.platformId)) {
            // Import leaflet and load map
            const L = await import('leaflet');
            this.map = L.map('map', {
                center: [39.8282, -98.5795],
                zoom: 3,
                worldCopyJump: true,
            });

            // Load tiles
            const tiles = L.tileLayer(
                'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                {
                    maxZoom: 18,
                    minZoom: 3,
                    attribution:
                        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                }
            );

            tiles.addTo(this.map);

            // Define Icons
            const factoryIcon = L.icon({
                iconUrl: 'assets/factory.png',
                iconSize: [40, 40],
                iconAnchor: [25, 25],
            });

            const warehouseIcon = L.icon({
                iconUrl: 'assets/warehouse.png',
                iconSize: [40, 40],
                iconAnchor: [25, 25],
            });

            const shipIcon = L.icon({
                iconUrl: 'assets/boat-with-containers.png',
                iconSize: [40, 40],
                iconAnchor: [25, 25],
            });

            const airplaneIcon = L.icon({
                iconUrl: 'assets/black-plane.png',
                iconSize: [40, 40],
                iconAnchor: [25, 25],
            });

            // Add items markers
            this.MockData.factories.forEach((factory) => {
                L.marker(
                    [factory.location.latitude, factory.location.longitude],
                    { icon: factoryIcon }
                ).addTo(this.map);
            });

            this.MockData.warehouses.forEach((warehouse) => {
                L.marker(
                    [warehouse.location.latitude, warehouse.location.longitude],
                    { icon: warehouseIcon }
                ).addTo(this.map);
            });

            this.MockData.ships.forEach((ship) => {
                L.marker(
                    [ship.currentLocation.latitude, ship.currentLocation.longitude],
                    { icon: shipIcon }
                ).addTo(this.map);
            });

            this.MockData.airplanes.forEach((airplane) => {
                L.marker(
                    [airplane.currentLocation.latitude, airplane.currentLocation.longitude],
                    { icon: airplaneIcon }
                ).addTo(this.map);
            });

            // Add routes
            this.MockData.shipmentRoutes.forEach((route) => {
                const routePoints: L.LatLngTuple[] = route.routeData as L.LatLngTuple[];
                const routeOverlay = L.polyline(routePoints, { color: 'blue' }).addTo(
                    this.map
                );
            });
        }
    }

    ngAfterViewInit(): void {
        this.initMap();
    }
}
