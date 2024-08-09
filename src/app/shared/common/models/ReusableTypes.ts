export interface UIItem {
    label: string;
    value: string;
}

export interface FilterOption {
    key: UIItem;
    valueOptions: UIItem[];
    filterType: FilterType;
}

export enum FilterType {
    DATE,
    NUMBER,
    ENUM
}

// Features
export interface Location {
    id: number;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    latitude: number;
    longitude: number;
    organizationId: number;
}

export interface CreateLocationDTO {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    latitude?: number;
    longitude?: number;
    organizationId: number;
}

export interface UpdateLocationDTO {
    id: number;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    latitude: number;
    longitude: number;
    organizationId: number;
}