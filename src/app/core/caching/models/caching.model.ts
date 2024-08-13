import { Factory } from "../../../dashboard/production/models/Factory";
import { Product } from "../../../dashboard/goods/models/Product";
import { PaginatedResults } from "../../../shared/search/models/searchTypes";

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
