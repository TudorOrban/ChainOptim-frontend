import { Factory } from "../../../dashboard/production/models/Factory";
import { Product } from "../../../dashboard/goods/models/Product";
import { Supplier } from "../../../dashboard/supply/models/Supplier";
import { Warehouse } from "../../../dashboard/storage/models/Warehouse";
import { PaginatedResults } from "../../../shared/search/models/PaginatedResults";

export interface AppState {
    products: ProductState;
    factories: FactoryState;
}

export interface CacheEntry<T> {
    lastFetched: number;
    data: T;
}

export interface ListState<T> {
    [queryKey: string]: CacheEntry<PaginatedResults<T>>;
}

export interface ProductState {
    products: ListState<Product>;
}

export const initialProductState: ProductState = {
    products: {},
};

export interface FactoryState {
    factories: ListState<Factory>;
}

export const initialFactoryState: FactoryState = {
    factories: {},
};

export interface QueryParams {
    organizationId: number;
    searchQuery: string;
    sortBy: string;
    ascending: boolean;
    page: number;
    itemsPerPage: number;
}

// export type EntityType = 'products' | 'factories' | 'warehouses' | 'suppliers';

// export type EntityData = PaginatedResults<Product> | PaginatedResults<Factory> | PaginatedResults<Warehouse> | PaginatedResults<Supplier>;

// export interface AppState {
//     products: ListState<Product>;
//     factories: ListState<Factory>;
//     warehouses: ListState<Warehouse>;
//     suppliers: ListState<Supplier>;
// }