import { Component } from "../../goods/models/Component";
import { Product } from "../../goods/models/Product";


export interface FactoryInventoryItem {
    id: number;
    factoryId: number;
    organizationId: number;
    createdAt: Date;
    updatedAt: Date;
    component?: Component;
    product?: Product;
    quantity?: number;
    minimumRequiredQuantity?: number;
    companyId?: string;
    selected?: boolean; // For UI purposes
    isEditing?: boolean; // For UI purposes
}

export interface CreateFactoryInventoryItemDTO {
    factoryId: number;
    organizationId: number;
    componentId?: number;
    productId?: number;
    quantity?: number;
    minimumRequiredQuantity?: number;
    companyId?: string;
}

export interface UpdateFactoryInventoryItemDTO {
    id: number;
    factoryId: number;
    organizationId: number;
    componentId?: number;
    productId?: number;
    quantity?: number;
    minimumRequiredQuantity?: number;
    companyId?: string;
}