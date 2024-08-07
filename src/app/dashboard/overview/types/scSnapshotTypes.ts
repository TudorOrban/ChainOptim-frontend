export interface SupplyChainSnapshot {
    id: number;
    organizationId: number;
    snapshot: Snapshot;
}

export interface Snapshot {
    membersCount: number;
    productsCount: number;
    componentsCount: number;
    factoriesCount: number;
    factoryInventoryItemsCount: number;
    warehousesCount: number;
    warehouseInventoryItemsCount: number;
    suppliersCount: number;
    supplierOrdersCount: number;
    clientsCount: number;
    clientOrdersCount: number;
}