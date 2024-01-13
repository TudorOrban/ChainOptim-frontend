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
}

export interface StageOutput {
    id: number;
    quantity: number;
}