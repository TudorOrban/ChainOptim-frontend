import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PaymentComponent } from '../payment/payment.component';
import { CustomSubscriptionPlan, PlanTier, BaseSubscriptionPlan } from '../../../../models/SubscriptionPlan';
import { CurrentPlanService } from '../../../../services/currentplan.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { Feature } from '../../../../../../shared/enums/commonEnums';
import { PaymentCalculatorService } from '../../../../services/paymentcalculator.service';
import { UIUtilService } from '../../../../../../shared/common/services/uiutil.service';
import { CustomPlanComponent } from '../custom-plan/custom-plan.component';
import { UserService } from '../../../../../../core/user/services/user.service';
import { User } from '../../../../../../core/user/model/user';
import { Router } from '@angular/router';
import { ToastService } from '../../../../../../shared/common/components/toast-system/toast.service';
import { OperationOutcome } from '../../../../../../shared/common/components/toast-system/toastTypes';

@Component({
    selector: 'app-subscription',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, FormsModule, MatExpansionModule, PaymentComponent, CustomPlanComponent],
    templateUrl: './subscription.component.html',
    styleUrl: './subscription.component.css'
})
export class SubscriptionComponent implements OnInit, OnDestroy {
    @ViewChild(PaymentComponent) paymentComponent!: PaymentComponent;
    
    currentUser: User | undefined = undefined;
    currentPlan: BaseSubscriptionPlan | undefined = undefined; 
    selectedPlanTier: PlanTier = PlanTier.NONE;   
    customPlan: CustomSubscriptionPlan = {
        planTier: PlanTier.NONE,
        additionalFeatures: this.initializeFeatures(0),
    }
    
    private planSubscription: Subscription = new Subscription();
    isMonthly: boolean = true;
    
    calculatorService: PaymentCalculatorService;
    uiUtilService: UIUtilService;

    constructor(
        private readonly userService: UserService,
        private readonly currentPlanService: CurrentPlanService,
        private readonly paymentCalculatorService: PaymentCalculatorService,
        private readonly utilService: UIUtilService,
        private readonly toastService: ToastService,
        private readonly router: Router
    ) {
        this.calculatorService = paymentCalculatorService;
        this.uiUtilService = utilService;
    }

    ngOnInit() {
        this.planSubscription = this.currentPlanService.currentPlan$.subscribe(data => {
            if (!data) return;
            this.customPlan = data;
        });
        this.userService.getCurrentUser().subscribe(user => {
            this.handleCurrentUser(user);
        });
    }

    private handleCurrentUser(user: User | null): void {
        if (!user) {
            console.error('User not found');
            return;
        }
        this.currentUser = user;
        if (!this.currentUser.organization) {
            this.toastService.addToast({
                id: 0,
                title: 'Organization not found',
                message: 'Please create an organization first',
                outcome: OperationOutcome.ERROR
            });
            this.router.navigate(['/dashboard/organization/create-organization']);
            return;
        }

        if (!this.currentUser.organization.isPlanBasic) {
            this.toastService.addToast({
                id: 0,
                title: 'Subscribed already',
                message: 'You are already subscribed to a plan. Use the \'Edit Subscription\' feature in Organization page',
                outcome: OperationOutcome.ERROR
            });
            this.router.navigate(['/dashboard/organization']);
        }
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
