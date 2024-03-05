export interface PaginatedResults<T> {
    results: T[];
    totalCount: number;
}

export interface CacheEntry<T> {
    lastFetched: number;
    staleTime: number;
    data: T;
}