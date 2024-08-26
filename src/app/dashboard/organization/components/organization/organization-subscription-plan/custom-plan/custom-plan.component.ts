import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { BaseSubscriptionPlan, CustomSubscriptionPlan, PlanTier, SubscriptionPlan } from '../../../../models/SubscriptionPlan';
import { Feature } from '../../../../../../shared/enums/commonEnums';
import { BaseSubscriptionPlanService } from '../../../../services/basesubscriptionplan.service';
import { PaymentCalculatorService } from '../../../../services/paymentcalculator.service';
import { UIUtilService } from '../../../../../../shared/common/services/uiutil.service';
import { CurrentPlanService } from '../../../../services/currentplan.service';
import { UserService } from '../../../../../../core/user/services/user.service';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-custom-plan',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule, MatExpansionModule],
  templateUrl: './custom-plan.component.html',
  styleUrl: './custom-plan.component.css'
})
export class CustomPlanComponent implements OnInit, OnChanges {
    @Input() existingPlan: SubscriptionPlan | undefined = undefined;
    @Input() isEditing?: boolean = false;
    @Input() isInPricingPage?: boolean = false;
    @Input() isExpanded?: boolean = false;

    isMonthly: boolean = true;
    selectedPlanTier: PlanTier = PlanTier.NONE;
    currentPlan: BaseSubscriptionPlan | undefined = undefined;

    customPlan: CustomSubscriptionPlan = {
        planTier: PlanTier.NONE,
        additionalFeatures: this.initializeFeatures(0),
    }

    Feature = Feature;
    PlanTier = PlanTier;

    planService: BaseSubscriptionPlanService;
    calculatorService: PaymentCalculatorService;
    uiUtilService: UIUtilService;

    faChevronDown = faChevronDown;
    faChevronUp = faChevronUp;

    constructor(
        planService: BaseSubscriptionPlanService,
        private currentPlanService: CurrentPlanService,
        private paymentCalculatorService: PaymentCalculatorService,
        private utilService: UIUtilService,
        private userService: UserService,
        private router: Router
    ) {
        this.planService = planService;
        this.calculatorService = paymentCalculatorService;
        this.uiUtilService = utilService;
        this.currentPlan = this.planService.getSubscriptionPlan(this.selectedPlanTier);
    }

    ngOnInit() {
        this.handleInputChanges();
        this.currentPlanService.currentPlan$.subscribe(data => {
            if (!data) return;
            console.log('CustomPlanComponent currentPlanService.currentPlan$ subscription:', data);
            this.customPlan = data;
            this.selectedPlanTier = data.planTier;
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.handleInputChanges(changes);
    }

    private handleInputChanges(changes?: SimpleChanges): void {
        if (!changes || (!changes['existingPlan'] && !changes['isEditing']) || !this.existingPlan) return;
        console.log('CustomPlanComponent input changes:');
        this.selectedPlanTier = this.existingPlan.customPlan?.planTier ?? PlanTier.NONE;
        this.customPlan = {
            totalDollarsMonthly: this.existingPlan.customPlan?.totalDollarsMonthly ?? 0,
            planTier: this.existingPlan.customPlan?.planTier ?? PlanTier.NONE,
            additionalFeatures: this.existingPlan.customPlan?.additionalFeatures ?? this.initializeFeatures(0),
        }
        this.isMonthly = this.existingPlan.customPlan?.isMonthly ?? true;
    }
    
    // Handlers
    expandCustomPlan(): void {
        this.isExpanded = !this.isExpanded;
    }

    selectPlanTier(planTier: PlanTier): void {
        this.selectedPlanTier = planTier;
        this.resetCustomPlan(planTier);
        this.currentPlan = this.planService.getSubscriptionPlan(planTier);
    }

    continueWithCustomPlan(): void {
        this.currentPlanService.setCurrentPlan(this.customPlan);

        this.userService.getCurrentUser().subscribe(user => {
            if (!user) {
                this.router.navigate(['/login']);
                this.currentPlanService.setPreparingToSubscribe(true);
                return;
            } 
            if (!user?.organization) {
                this.router.navigate(['/dashboard/organization/create']);
                return;
            }

            this.router.navigate(['/dashboard/organization/subscribe']);
        });

    }

    // Utils
    private resetCustomPlan(planTier: PlanTier): void {
        this.customPlan = {
            planTier: planTier,
            additionalFeatures: this.initializeFeatures(0),
        };
    }

    decapitalize(word?: string) {
        if (!word) return '';
        return word.charAt(0) + word.slice(1).toLowerCase();
    }
    
    initializeFeatures(defaultValue: number): Record<Feature, number> {
        return Object.values(Feature).reduce((acc, key) => {
            acc[key as Feature] = defaultValue;
            return acc;
        }, {} as Record<Feature, number>);
    }

}
