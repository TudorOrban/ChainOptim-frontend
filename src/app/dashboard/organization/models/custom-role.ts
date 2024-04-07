export interface CustomRole {
    id: number;
    name: string;
    organizationId: number;
    createdAt: Date;
    updatedAt: Date;
    permissions: Permissions;
}

export interface Permissions {
    products: FeaturePermissions;
    factories: FeaturePermissions;
    warehouses: FeaturePermissions;
    suppliers: FeaturePermissions;
    clients: FeaturePermissions;
}

export interface FeaturePermissions {
    canRead: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
}