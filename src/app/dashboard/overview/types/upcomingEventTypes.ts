export interface UpcomingEvent {
    id: number;
    organizationId: number;
    title: string;
    message: string;
    dateTime: Date;
    associatedEntityId: number;
    associatedEntityType: Feature;
}

export enum Feature {
    PRODUCT = 'PRODUCT',
    COMPONENT = 'COMPONENT',
    FACTORY = 'FACTORY',
    WAREHOUSE = 'WAREHOUSE',
    SUPPLIER = 'SUPPLIER',
    CLIENT = 'CLIENT',
}