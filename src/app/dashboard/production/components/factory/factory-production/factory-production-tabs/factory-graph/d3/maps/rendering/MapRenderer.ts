import * as L from 'leaflet';
import { Facility, MapData } from "../types/dataTypes";


export class MapRenderer {
    private map: L.Map;

    constructor() {
        this.map = L.map('map');
    }

    public renderMap(mapData: MapData): void {
        this.initMap();
        if (this.map === undefined) {
            console.error("Map not initialized");
            return;
        }

        this.map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                this.map?.removeLayer(layer);
            }
        });

        mapData.facilities.forEach((facility) => {
            if (facility.latitude && facility.longitude) {
                const marker = L.marker([facility.latitude, facility.longitude]).addTo(this.map);
                marker.bindPopup(this.generatePopupContent(facility));
            }
        });
    }

    private initMap(): void {
        this.map = L.map('map', {
            center: [39.8282, -98.5795],
            zoom: 5,
            worldCopyJump: true,
        });

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

        this.map.on('click', (e: L.LeafletMouseEvent) => {
            const clickedLat = e.latlng.lat;
            const clickedLng = e.latlng.lng;
            console.log(
                `Latitude: ${clickedLat}, Longitude: ${clickedLng}`
            );

        });
    }

    private generatePopupContent(facility: Facility): string {
        return `<b>${facility.name}</b><br>Type: ${facility.type}<br>`;
    }

}