export interface UserSettings {
    id: number;
    userId: string;
    generalSettings: GeneralSettings;
    notificationSettings: NotificationSettings;
}

export interface NotificationSettings {
    supplierOrdersOn: boolean;
    supplierShipmentsOn: boolean;
    clientOrdersOn: boolean;
    clientShipmentsOn: boolean;
    factoryInventoryOn: boolean;
    warehouseInventoryOn: boolean;
    emailSuppliersOrdersOn: boolean;
    emailSuppliersShipmentsOn: boolean;
    emailClientsOrdersOn: boolean;
    emailClientsShipmentsOn: boolean;
    emailFactoriesInventoryOn: boolean;
    emailWarehousesInventoryOn: boolean;
}

export interface GeneralSettings {
    infoLevel: InfoLevel;

}

export enum InfoLevel {
    NONE,
    ADVANCED,
    ALL
}