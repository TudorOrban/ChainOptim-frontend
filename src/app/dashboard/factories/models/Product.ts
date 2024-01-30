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
    material?: RawMaterial;
    componentId: number;
    component?: Component;
}

export interface StageOutput {
    id: number;
    quantity: number;
    componentId: number;
    component?: Component;
}

export interface RawMaterial {
    id: number;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Component {
    id: number;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}