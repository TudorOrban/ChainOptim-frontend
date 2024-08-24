import { Injectable } from "@angular/core";
import { CustomSubscriptionPlan } from "../../../dashboard/organization/models/SubscriptionPlan";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class CurrentPlanService {
    private currentPlanSource = new BehaviorSubject<CustomSubscriptionPlan | undefined>(undefined);
    currentPlan$ = this.currentPlanSource.asObservable();

    setCurrentPlan(plan: CustomSubscriptionPlan): void {
        this.currentPlanSource.next(plan);
    }

    getCurrentPlan(): CustomSubscriptionPlan | undefined {
        return this.currentPlanSource.getValue();
    }
}