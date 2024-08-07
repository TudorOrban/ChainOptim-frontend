export interface SortOption {
    value: string;
    label: string;
}

export interface SearchParams {
    searchQuery: string;
    sortOption: string;
    ascending: boolean;
    page: number;
    itemsPerPage: number;
    filters?: Record<string, string>;
}