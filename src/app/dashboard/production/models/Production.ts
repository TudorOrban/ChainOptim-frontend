import { Component, Type } from "@angular/core";
import { FactoryGraphComponent } from "../components/factory/factory-production/factory-production-tabs/factory-graph/factory-graph.component";
import { AllocationPlanComponent } from "../components/factory/factory-production/factory-production-tabs/allocation-plan/allocation-plan.component";
import { AddFactoryStageComponent } from "../components/factory/factory-production/factory-production-tabs/add-factory-stage/add-factory-stage.component";
import { UpdateFactoryStageComponent } from "../components/factory/factory-production/factory-production-tabs/update-factory-stage/update-factory-stage.component";
import { ProductionHistoryComponent } from "../components/factory/factory-production/factory-production-tabs/production-history/production-history.component";

export type FactoryProductionTabType = FactoryGraphComponent | AllocationPlanComponent | AddFactoryStageComponent | UpdateFactoryStageComponent | ProductionHistoryComponent;

export interface Tab<T> {
    id: string;
    title: string;
    component: Type<FactoryProductionTabType>;
    inputData: T;
}