import { Component } from "./Component";


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
    componentId: number;
    component?: Component;
}

export interface StageOutput {
    id: number;
    quantity: number;
    componentId: number;
    component?: Component;
}

export interface CreateStageDTO {
    productId: number;
    organizationId: number;
    name: string;
    description?: string;
}

export interface UpdateStageDTO {
    id: number;
    productId: number;
    organizationId: number;
    name: string;
    description?: string;
}

export interface CreateStageInputDTO {
    productId: number;
    organizationId: number;
    stageId: number;
    componentId: number;
    quantity: number;
}

export interface UpdateStageInputDTO {
    id: number;
    productId: number;
    organizationId: number;
    stageId: number;
    componentId: number;
    quantity: number;
}

export interface DeleteStageInputDTO {
    stageInputId: number;
    productId: number;
    organizationId: number;
}

export interface CreateStageOutputDTO {
    productId: number;
    organizationId: number;
    stageId: number;
    componentId?: number;
    outputProductId?: number;
    quantity: number;
}

export interface UpdateStageOutputDTO {
    id: number;
    productId: number;
    organizationId: number;
    stageId: number;
    componentId?: number;
    outputProductId?: number;
    quantity: number;
}

export interface DeleteStageOutputDTO {
    stageOutputId: number;
    productId: number;
    organizationId: number;
}

export interface ProductStageConnection {
    id: number;
    productId: number;
    srcProductStageId: number;
    srcStageOutputId: number;
    destProductStageId: number;
    destStageInputId: number;
}

export interface CreateConnectionDTO {
    productId: number;
    srcProductStageId: number;
    srcStageOutputId: number;
    destProductStageId: number;
    destStageInputId: number;
}

export interface UpdateConnectionDTO {
    id: number;
    productId: number;
    srcProductStageId: number;
    srcStageOutputId: number;
    destProductStageId: number;
    destStageInputId: number;
}

export interface DeleteConnectionDTO {
    productId: number;
    organizationId: number;
    srcProductStageId: number;
    srcStageOutputId: number;
    destProductStageId: number;
    destStageInputId: number;
}

