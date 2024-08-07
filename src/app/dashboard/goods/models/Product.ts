import { UnitOfMeasurement } from "./UnitOfMeasurement";

export interface Product {
    id: number;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    stages?: Stage[];
}

export interface Stage {
    id: number;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    productId: number;
    organizationId?: number;
    stageInputs?: StageInput[];
    stageOutputs?: StageOutput[];
}

export interface StageInput {
    id: number;
    quantity: number;
    materialId: number;
    componentId: number;
    component?: Component;
}

export interface StageOutput {
    id: number;
    quantity: number;
    componentId: number;
    component?: Component;
}

export interface Component {
    id: number;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateProductDTO {
    name: string;
    description: string;
    organizationId: number;
    newUnit: UnitOfMeasurement;    
}

export interface UpdateProductDTO {
    id: number;
    name: string;
    description: string;
    organizationId: number;
    newUnit: UnitOfMeasurement;    
}