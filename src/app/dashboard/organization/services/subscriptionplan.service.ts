import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SubscriptionPlan } from "../models/SubscriptionPlan";
import { Observable } from "rxjs";
import { CreateSubscriptionPlanDTO } from "../../../core/payment/models/SubscriptionPlan";

@Injectable({
    providedIn: 'root'
})
export class SubscriptionPlanService {
    private apiUrl = 'http://localhost:8080/api/v1/subscription-plans';

    constructor(private http: HttpClient) {}

    getSubscriptionPlanByOrganizationId(organizationId: number): Observable<SubscriptionPlan> {
        return this.http.get<SubscriptionPlan>(`${this.apiUrl}/organization/${organizationId}`);
    }
    
    createSubscriptionPlan(planDTO: CreateSubscriptionPlanDTO): Observable<{ sessionId: string }> {
        console.log('Creating custom plan:', planDTO);
        return this.http.post<{ sessionId: string }>(`${this.apiUrl}/create`, planDTO);
    }
}