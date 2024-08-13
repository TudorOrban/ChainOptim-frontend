import { Component } from "../../goods/models/Component";
import { Product } from "../../goods/models/Product";


export interface WarehouseInventoryItem {
    id: number;
    warehouseId: number;
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

export interface CreateWarehouseInventoryItemDTO {
    warehouseId: number;
    organizationId: number;
    componentId?: number;
    productId?: number;
    quantity?: number;
    minimumRequiredQuantity?: number;
    companyId?: string;
}

export interface UpdateWarehouseInventoryItemDTO {
    id: number;
    warehouseId: number;
    organizationId: number;
    componentId?: number;
    productId?: number;
    quantity?: number;
    minimumRequiredQuantity?: number;
    companyId?: string;
}