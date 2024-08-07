import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from "@ngrx/store";
import { catchError, map, mergeMap, of, take } from "rxjs";
import { ProductService } from "../../../dashboard/goods/services/product.service";
import { loadProducts, productsLoaded } from "../actions/generic.actions";
import { selectProductData } from "../selectors/product.selectors";
import { AppState } from "../models/caching.model";

@Injectable()
export class ProductEffects {
    constructor(
        private actions$: Actions,
        private productService: ProductService,
        private store: Store<AppState>
    ) {}

    loadProducts$ = createEffect(() => this.actions$.pipe(
        ofType(loadProducts),
        mergeMap(action => this.store.select(selectProductData(action.queryKey))
            .pipe(
                take(1),
                mergeMap(cacheEntry => {
                    // If cache exists and is fresh, use it, otherwise fetch new data
                    if (cacheEntry && (Date.now() - cacheEntry.lastFetched) < 300000) {
                        return of(productsLoaded({ queryKey: action.queryKey, data: cacheEntry.data }));
                    } else {
                        return this.productService.getProductsByOrganizationIdAdvanced(
                            action.queryParams.organizationId,
                            action.queryParams.searchQuery,
                            action.queryParams.sortBy,
                            action.queryParams.ascending,
                            action.queryParams.page,
                            action.queryParams.itemsPerPage
                        ).pipe(
                            map(data => productsLoaded({ queryKey: action.queryKey, data })),
                            catchError(error => {
                                console.error(error);
                                return of();
                            })
                        );
                    }
                })
            )
        )
    ));
}
