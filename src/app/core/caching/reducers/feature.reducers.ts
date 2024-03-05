import { createReducer, on } from "@ngrx/store";
import { initialFactoryState, initialProductState } from "../models/caching.model";
import { factoriesLoaded, productsLoaded } from "../actions/generic.actions";

export const productReducer = createReducer(
    initialProductState,
    on(productsLoaded, (state, { queryKey, data }) => ({
        ...state,
        products: {
            ...state.products,
            [queryKey]: {
                lastFetched: Date.now(),
                data: data,
            }
        }
    }))
);

export const factoryReducer = createReducer(
    initialFactoryState,
    on(factoriesLoaded, (state, { queryKey, data }) => ({
        ...state,
        factorys: {
            ...state.factories,
            [queryKey]: {
                lastFetched: Date.now(),
                data: data,
            }
        }
    }))
);