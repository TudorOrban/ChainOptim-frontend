import { CustomSubscriptionPlan } from "../../../dashboard/organization/models/SubscriptionPlan";

export interface CreateSubscriptionPlanDTO {
    organizationId: number;
    customPlan: CustomSubscriptionPlan;
    isBasic?: boolean;
}

export interface UpdateSubscriptionPlanDTO {
    id: number;
    organizationId: number;
    customPlan: CustomSubscriptionPlan;
    isBasic?: boolean;
}