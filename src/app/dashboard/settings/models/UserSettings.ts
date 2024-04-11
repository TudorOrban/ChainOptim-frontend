export interface UserSettings {
    id: number;
    userId: string;
    notificationSettings: NotificationSettings;
}

export interface NotificationSettings {
    supplierOrdersOn: boolean;
    clientOrdersOn: boolean;
    factoryInventoryOn: boolean;
    warehouseInventoryOn: boolean;
}