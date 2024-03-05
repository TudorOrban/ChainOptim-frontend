import { Factory } from "../../../dashboard/factories/models/Factory";
import { Product } from "../../../dashboard/products/models/Product";
import { Supplier } from "../../../dashboard/suppliers/models/Supplier";
import { Warehouse } from "../../../dashboard/warehouses/models/Warehouse";
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