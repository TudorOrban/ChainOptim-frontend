export interface SortOption {
    value: string;
    label: string;
}

export interface SearchOptions {
    searchQuery: string;
    sortOption: string;
    ascending: boolean;
    page: number;
    itemsPerPage: number;
}