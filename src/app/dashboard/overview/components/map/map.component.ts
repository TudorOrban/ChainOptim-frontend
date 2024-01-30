import { isPlatformBrowser } from '@angular/common';
import {
    AfterViewInit,
    Component,
    EmbeddedViewRef,
    Inject,
    PLATFORM_ID,
    ViewContainerRef,
} from '@angular/core';
import { FactoryCardComponent } from './cards/factory-card/factory-card.component';
import { WarehouseCardComponent } from './cards/warehouse-card/warehouse-card.component';
import { ShipCardComponent } from './cards/ship-card/ship-card.component';
import { AirplaneCardComponent } from './cards/airplane-card/airplane-card.component';

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
                    latitude: 40.713955826286046,
                    longitude: -3.922034431804742,
                },
            },
            {
                id: 3,
                location: {
                    latitude: -7.362466865535738,
                    longitude: -60.1486330742347,
                },
            },
        ],
        warehouses: [
            {
                id: 1,
                location: {
                    latitude: 43.32517767999296,
                    longitude: 0.2949604663774786,
                },
            },
            {
                id: 2,
                location: {
                    latitude: 36.87962060502676,
                    longitude: -119.3622697695437,
                },
            },
            {
                id: 3,
                location: {
                    latitude: 5.965753671065536,
                    longitude: -74.02957461408457,
                },
            },
        ],
        shipmentRoutes: [
            {
                id: 1,
                routeData: [
                    [39.8282, -98.5795],
                    [36.87962060502676, -119.3622697695437],
                ],
            },
            {
                id: 2,
                routeData: [
                    [-7.362466865535738, -60.1486330742347],
                    [5.965753671065536, -74.02957461408457],
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

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private viewContainerRef: ViewContainerRef
    ) {}

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

                // You can also call a method here to handle the click event
                // this.handleMapClick(clickedLat, clickedLng);
            });
        }
    }

    private createMapElements(): void {
        // Add markers for sites and transportation
        this.MockData.factories.forEach((factory) => {
            this.createFactoryMarker(factory);
        });
        this.MockData.warehouses.forEach((warehouse) => {
            this.createWarehouseMarker(warehouse);
        });
        this.MockData.ships.forEach((ship) => {
            this.createShipMarker(ship);
        });
        this.MockData.airplanes.forEach((airplane) => {
            this.createAirplaneMarker(airplane);
        });

        // Add routes
        this.MockData.shipmentRoutes.forEach((route) => {
            const routePoints: L.LatLngTuple[] =
                route.routeData as L.LatLngTuple[];
            const routeOverlay = this.L.polyline(routePoints, {
                color: 'blue',
            }).addTo(this.map);
        });
    }

    // Create component markers for sites and transportation
    private createFactoryMarker(factoryData: any): void {
        if (!this.L) {
            console.error('Leaflet (L) is not available.');
            return;
        }

        // Dynamically create the FactoryCardComponent
        const componentRef =
            this.viewContainerRef.createComponent(FactoryCardComponent);

        // Access the DOM element of the component
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;

        // Create a Leaflet marker with the component's element
        const marker = this.L.marker(
            [factoryData.location.latitude, factoryData.location.longitude],
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

    private createWarehouseMarker(warehouseData: any): void {
        if (!this.L) {
            console.error('Leaflet (L) is not available.');
            return;
        }

        const componentRef = this.viewContainerRef.createComponent(
            WarehouseCardComponent
        );

        const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;

        const marker = this.L.marker(
            [warehouseData.location.latitude, warehouseData.location.longitude],
            {
                icon: this.L.divIcon({
                    html: domElem,
                    className: 'flex justify-center',
                    iconSize: [30, 30],
                }),
            }
        );

        marker.addTo(this.map);
    }

    private createShipMarker(shipData: any): void {
        if (!this.L) {
            console.error('Leaflet (L) is not available.');
            return;
        }

        const componentRef =
            this.viewContainerRef.createComponent(ShipCardComponent);

        const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;

        const marker = this.L.marker(
            [
                shipData.currentLocation.latitude,
                shipData.currentLocation.longitude,
            ],
            {
                icon: this.L.divIcon({
                    html: domElem,
                    className: 'flex justify-center',
                    iconSize: [30, 30],
                }),
            }
        );

        marker.addTo(this.map);
    }

    ngAfterViewInit(): void {
        this.initMap();
    }

    private createAirplaneMarker(airplaneData: any): void {
        if (!this.L) {
            console.error('Leaflet (L) is not available.');
            return;
        }

        const componentRef = this.viewContainerRef.createComponent(
            AirplaneCardComponent
        );

        const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;

        const marker = this.L.marker(
            [
                airplaneData.currentLocation.latitude,
                airplaneData.currentLocation.longitude,
            ],
            {
                icon: this.L.divIcon({
                    html: domElem,
                    className: 'flex justify-center',
                    iconSize: [30, 30],
                }),
            }
        );

        marker.addTo(this.map);
    }
}
