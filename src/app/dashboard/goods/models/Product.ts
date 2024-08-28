import { SmallEntityDTO } from "../../../shared/common/models/reusableTypes";
import { Stage } from "./Stage";
import { UnitOfMeasurement } from "./UnitOfMeasurement";

export interface Product {
    id: number;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    stages?: Stage[];
    unit?: UnitOfMeasurement;
    
}

export interface CreateProductDTO {
    name: string;
    description: string;
    organizationId: number;
    unit: UnitOfMeasurement;    
}

export interface UpdateProductDTO {
    id: number;
    name: string;
    description: string;
    organizationId: number;
    unit: UnitOfMeasurement;    
}

export interface ProductOverviewDTO {
    stages: SmallEntityDTO[];
    manufacturedInFactories: SmallEntityDTO[];
    storedInWarehouses: SmallEntityDTO[];
    orderedByClients: SmallEntityDTO[];
}

export interface ProductSearchDTO {
    id: number;
    name: string;
}

export interface Pricing {
    id: number;
    productId: number;
    productPricing: ProductPricing;
}

export interface ProductPricing {
    pricePerUnit: number;
    pricePerVolume: Record<number, number>;
}

export interface CreatePricingDTO {
    productId: number;
    productPricing: ProductPricing;
}

export interface UpdatePricingDTO {
    id: number;
    productId: number;
    productPricing: ProductPricing;
}