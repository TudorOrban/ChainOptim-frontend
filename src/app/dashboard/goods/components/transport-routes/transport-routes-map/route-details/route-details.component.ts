import { Component, Input } from '@angular/core';
import { ResourceTransportRoute, TransportedEntity, TransportedEntityType } from '../../../../models/TransportRoute';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-route-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './route-details.component.html',
  styleUrl: './route-details.component.css'
})
export class RouteDetailsComponent {
    @Input() route: ResourceTransportRoute | undefined = undefined;

    TransportedEntityType = TransportedEntityType;
    transportedComponents: TransportedEntity[] = [];
    transportedProducts: TransportedEntity[] = [];

    constructor() { }

    ngOnChanges(): void {
        this.updateTransportedEntities();
    }

    ngOnInit(): void {
        this.updateTransportedEntities();
    }

    updateTransportedEntities(): void {
        console.log('RouteDetailsComponent: updateTransportedEntities:', this.route?.transportRoute?.transportedEntities);
        this.transportedComponents = this.route?.transportRoute?.transportedEntities?.filter(entity => entity.entityType === TransportedEntityType.COMPONENT) || [];
        this.transportedProducts = this.route?.transportRoute?.transportedEntities?.filter(entity => entity.entityType === TransportedEntityType.PRODUCT) || [];
        console.log("products: ", this.transportedProducts);
    }

    getTransportedComponents(): TransportedEntity[] {
        return this.transportedComponents;
    }

    getTransportedProducts(): TransportedEntity[] {
        return this.transportedProducts;
    }
    
    decapitalize(word?: string) {
        if (!word) return '';
        return word.charAt(0) + word.slice(1).toLowerCase();
    }
}
