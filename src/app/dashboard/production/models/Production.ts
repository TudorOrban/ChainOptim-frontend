import { Type } from "@angular/core";
import { FactoryGraphComponent } from "../components/factory/factory-production/factory-production-tabs/factory-graph/factory-graph.component";
import { AllocationPlanComponent } from "../components/factory/factory-production/factory-production-tabs/allocation-plan/allocation-plan.component";
import { AddFactoryStageComponent } from "../components/factory/factory-production/factory-production-tabs/add-factory-stage/add-factory-stage.component";
import { UpdateFactoryStageComponent } from "../components/factory/factory-production/factory-production-tabs/update-factory-stage/update-factory-stage.component";
import { ProductionHistoryComponent } from "../components/factory/factory-production/factory-production-tabs/production-history/production-history.component";
import { ProductGraphComponent } from "../../goods/components/product/product-production/product-production-tabs/product-graph/product-graph.component";
import { AddStageComponent } from "../../goods/components/product/product-production/product-production-tabs/add-stage/add-stage.component";
import { UpdateStageComponent } from "../../goods/components/product/product-production/product-production-tabs/update-stage/update-stage.component";
import { AddStageInputComponent } from "../../goods/components/product/product-production/product-production-tabs/add-stage-input/add-stage-input.component";
import { UpdateStageInputComponent } from "../../goods/components/product/product-production/product-production-tabs/update-stage-input/update-stage-input.component";
import { AddStageOutputComponent } from "../../goods/components/product/product-production/product-production-tabs/add-stage-output/add-stage-output.component";
import { UpdateStageOutputComponent } from "../../goods/components/product/product-production/product-production-tabs/update-stage-output/update-stage-output.component";

export type FactoryProductionTabType = FactoryGraphComponent | AllocationPlanComponent | AddFactoryStageComponent | UpdateFactoryStageComponent | ProductionHistoryComponent;

export interface Tab<T> {
    id: string;
    title: string;
    component: Type<FactoryProductionTabType>;
    inputData: T;
}

export type ProductProductionTabType = ProductGraphComponent | 
    AddStageComponent | UpdateStageComponent | 
    AddStageInputComponent | UpdateStageInputComponent |
    AddStageOutputComponent | UpdateStageOutputComponent;

export interface ProductTab<T> {
    id: string;
    title: string;
    component: Type<ProductProductionTabType>;
    inputData: T;
}