import { UnitOfMeasurement } from "./UnitOfMeasurement";

export interface Component {
    id: number;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}


export interface CreateComponentDTO {
    name: string;
    description: string;
    organizationId: number;
    unit: UnitOfMeasurement;    
}

export interface UpdateComponentDTO {
    id: number;
    name: string;
    description: string;
    organizationId: number;
    unit: UnitOfMeasurement;    
}

export interface ComponentSearchDTO {
    id: number;
    name: string;
}