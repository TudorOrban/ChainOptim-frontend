import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PaymentComponent } from '../payment/payment.component';
import { CustomSubscriptionPlan, FeaturePricing, PlanTier, BaseSubscriptionPlan } from '../../../../dashboard/organization/models/SubscriptionPlan';
import { CurrentPlanService } from '../../services/currentplan.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { Feature } from '../../../../shared/enums/commonEnums';
import { PaymentCalculatorService } from '../../services/paymentcalculator.service';
import { UIUtilService } from '../../../../shared/common/services/uiutil.service';

@Component({
    selector: 'app-subscription',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, FormsModule, MatExpansionModule, PaymentComponent],
    templateUrl: './subscription.component.html',
    styleUrl: './subscription.component.css'
})
export class SubscriptionComponent implements OnInit, OnDestroy {
    @ViewChild(PaymentComponent) paymentComponent!: PaymentComponent;

    currentPlan: BaseSubscriptionPlan | undefined = undefined; 
    selectedPlanTier: PlanTier = PlanTier.NONE;   
    customPlan: CustomSubscriptionPlan = {
        basePlanTier: PlanTier.NONE,
        additionalFeatures: this.initializeFeatures(0),
    }
    
    private planSubscription: Subscription = new Subscription();
    isMonthly: boolean = true;
    
    calculatorService: PaymentCalculatorService;
    uiUtilService: UIUtilService;

    constructor(
        private currentPlanService: CurrentPlanService,
        private paymentCalculatorService: PaymentCalculatorService,
        private utilService: UIUtilService
    ) {
        this.calculatorService = paymentCalculatorService;
        this.uiUtilService = utilService;
    }

    ngOnInit() {
        this.planSubscription = this.currentPlanService.currentPlan$.subscribe(data => {
            if (!data) return;
            this.customPlan = data;
        });
    }
    
    confirmSubscription(): void {
        if (this.paymentComponent) {
            this.paymentComponent.confirmPayment();
        } else {
            console.error('PaymentComponent is not yet loaded');
        }
    }
    
    ngOnDestroy(): void {
        this.planSubscription.unsubscribe();
    }

    // Utils
    initializeFeatures(defaultValue: number): Record<Feature, number> {
        return Object.values(Feature).reduce((acc, key) => {
            acc[key as Feature] = defaultValue;
            return acc;
        }, {} as Record<Feature, number>);
    }
}
