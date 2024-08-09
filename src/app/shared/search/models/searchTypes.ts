export interface SearchParams {
    searchQuery: string;
    sortOption: string;
    ascending: boolean;
    page: number;
    itemsPerPage: number;
    filters?: Record<string, string>;
}

export interface SearchOptions {
    filterOptions: FilterOption[];
    sortOptions?: UIItem[];
}

export interface FilterOption {
    key: UIItem;
    valueOptions: UIItem[];
    filterType: FilterType;
}

export interface UIItem {
    label: string;
    value: string;
}

export enum FilterType {
    DATE,
    NUMBER,
    ENUM
}

export interface SortOption {
    value: string;
    label: string;
}

export interface PaginatedResults<T> {
    results: T[];
    totalCount: number;
}

export interface CacheEntry<T> {
    lastFetched: number;
    staleTime: number;
    data: T;
}

