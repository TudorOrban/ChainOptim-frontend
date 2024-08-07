import { createAction, props } from "@ngrx/store";
import { QueryParams } from "../models/caching.model";
import { PaginatedResults } from "../../../shared/search/models/searchTypes";
import { Product } from "../../../dashboard/goods/models/Product";
import { Factory } from "../../../dashboard/production/models/Factory";

export const loadProducts = createAction(
    '[Products] Load', 
    props<{ queryKey: string; queryParams: QueryParams }>()
);
export const productsLoaded = createAction(
    '[Products API] Loaded', 
    props<{ queryKey: string; data: PaginatedResults<Product> }>()
);

export const loadFactories = createAction(
    '[Factories] Load', 
    props<{ queryKey: string; queryParams: QueryParams }>()
);
export const factoriesLoaded = createAction(
    '[Factories API] Loaded', 
    props<{ queryKey: string; data: PaginatedResults<Factory> }>()
);