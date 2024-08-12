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

export interface SmallEntityDTO {
    id: number;
    name: string;
}