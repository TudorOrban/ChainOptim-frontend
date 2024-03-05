import { createSelector } from "@ngrx/store";
import { AppState } from "../models/caching.model";

export const selectProductState = (state: AppState) => state.products;

export const selectProductData = (queryKey: string) => createSelector(
    selectProductState,
    productState => productState.products[queryKey]
);

