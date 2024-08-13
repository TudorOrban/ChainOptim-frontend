import { Component } from "../../goods/models/Component";


export interface SupplierOrder {
    id: number;
    supplierId: number;
    createdAt: Date;
    updatedAt: Date;
    component?: Component;
    organizationId: number;
    quantity?: number;
    deliveredQuantity?: number;
    orderDate?: Date;
    estimatedDeliveryDate?: Date;
    deliveryDate?: Date;
    companyId?: string;
    status?: OrderStatus;
    selected?: boolean; // For UI purposes
    isEditing?: boolean; // For UI purposes
}

export enum OrderStatus {
    INITIATED = 'INITIATED',
    NEGOTIATED = 'NEGOTIATED',
    PLACED = 'PLACED',
    DELIVERED = 'DELIVERED',
    CANCELED = 'CANCELED',
}

export interface CreateSupplierOrderDTO {
    supplierId: number;
    componentId?: number;
    organizationId: number;
    quantity?: number;
    orderDate?: Date;
    estimatedDeliveryDate?: Date;
    deliveryDate?: Date;
    companyId?: string;
    status?: OrderStatus;
}

export interface UpdateSupplierOrderDTO {
    id: number;
    supplierId: number;
    componentId?: number;
    organizationId: number;
    quantity?: number;
    orderDate?: Date;
    estimatedDeliveryDate?: Date;
    deliveryDate?: Date;
    companyId?: string;
    status?: OrderStatus;
}