export interface SortOption {
    value: string;
    label: string;
}

export interface SearchOptions {
    searchQuery: string;
    sortOption: SortOption;
    ascending: boolean;
    page: number;
    itemsPerPage: number;
}