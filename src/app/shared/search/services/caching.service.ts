import { Injectable } from "@angular/core";
import { SearchParams, CacheEntry } from "../models/searchTypes";

/**
 * Service for caching search query results for the pages Products, Factories etc.
 */
@Injectable({
    providedIn: 'root'
})
export class CachingService<T> {

    private readonly cache: Map<string, CacheEntry<T>> = new Map<string, CacheEntry<T>>();

    isCached(key: string): boolean {
        return this.cache.has(key);
    }

    isStale(key: string): boolean {
        if (this.isCached(key)) {
            let entry = this.cache.get(key);
            let isStale = Date.now() - (entry?.lastFetched ?? 0) > (entry?.staleTime ?? 0);
            if (isStale) {
                this.invalidateCache(key);
            }
            return isStale;
        } else {
            return true;
        }
    }

    invalidateCache(key: string): void {
        if (this.isCached(key)) {
            this.cache.delete(key);
        }
    }

    invalidateAllCache(): void {
        this.cache.clear();
    }

    getFromCache(key: string): T | undefined {
        if (this.isCached(key)) {
            return this.cache.get(key)?.data;
        }
        return undefined;
    }

    addToCache(key: string, value: T, staleTime: number = 8000): void {
        if (!this.isCached(key)) {
            this.cache.set(key, {
                lastFetched: Date.now(),
                staleTime,
                data: value
            });
        }
    }

    createCacheKey(feature: string, organizationId: number, searchParams: SearchParams): string {
        let url = `${feature}/organization/advanced/${organizationId}?searchQuery=${encodeURIComponent(searchParams.searchQuery)}&sortBy=${encodeURIComponent(searchParams.sortOption)}&ascending=${searchParams.ascending}&page=${searchParams.page}&itemsPerPage=${searchParams.itemsPerPage}`;
        
        if (searchParams.filters && Object.keys(searchParams.filters).length > 0) {
            const filtersJson = JSON.stringify(searchParams.filters);
            const encodedFilters = encodeURIComponent(filtersJson);
            url += `&filters=${encodedFilters}`;
        }
        
        return url;
    }
}