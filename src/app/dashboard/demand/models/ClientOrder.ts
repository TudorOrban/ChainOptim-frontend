import { Component } from "../../goods/models/Component";
import { Product } from "../../goods/models/Product";
import { OrderStatus } from "../../supply/models/SupplierOrder";


export interface ClientOrder {
    id: number;
    clientId: number;
    createdAt: Date;
    updatedAt: Date;
    product: Product;
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

export interface CreateClientOrderDTO {
    clientId: number;
    productId?: number;
    organizationId: number;
    quantity?: number;
    orderDate?: Date;
    estimatedDeliveryDate?: Date;
    deliveryDate?: Date;
    companyId?: string;
    status?: OrderStatus;
}

export interface UpdateClientOrderDTO {
    id: number;
    clientId: number;
    productId?: number;
    organizationId: number;
    quantity?: number;
    orderDate?: Date;
    estimatedDeliveryDate?: Date;
    deliveryDate?: Date;
    companyId?: string;
    status?: OrderStatus;
}