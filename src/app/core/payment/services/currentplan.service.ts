import { Injectable } from "@angular/core";
import { CustomSubscriptionPlan } from "../../../dashboard/organization/models/SubscriptionPlan";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class CurrentPlanService {
    private currentPlanSource = new BehaviorSubject<CustomSubscriptionPlan | undefined>(undefined);
    currentPlan$ = this.currentPlanSource.asObservable();

    private isPreparingToSubscribe: boolean = false;

    setCurrentPlan(plan: CustomSubscriptionPlan): void {
        this.currentPlanSource.next(plan);
    }

    getCurrentPlan(): CustomSubscriptionPlan | undefined {
        return this.currentPlanSource.getValue();
    }

    setPreparingToSubscribe(preparing: boolean): void {
        this.isPreparingToSubscribe = preparing;
    }

    getPreparingToSubscribe(): boolean {
        return this.isPreparingToSubscribe;
    }
}