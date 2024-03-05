import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { AppState } from "../models/caching.model";
import { factoryReducer, productReducer } from "./feature.reducers";

export const reducers: ActionReducerMap<AppState> = {
    products: productReducer,
    factories: factoryReducer
};

export const metaReducers: MetaReducer<AppState>[] = [];