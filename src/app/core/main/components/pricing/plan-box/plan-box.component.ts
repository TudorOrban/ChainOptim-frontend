import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlanTier, BaseSubscriptionPlan } from '../../../../../dashboard/organization/models/SubscriptionPlan';
import { BaseSubscriptionPlanService } from '../../../../../dashboard/organization/services/basesubscriptionplan.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { faCircleCheck, faGear, faIndustry, faTruck, faUniversalAccess, faUser, faWarehouse } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-plan-box',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './plan-box.component.html',
  styleUrl: './plan-box.component.css'
})
export class PlanBoxComponent implements OnInit {
    @Input() planTier: PlanTier | undefined = undefined;
    @Output() customizePlan = new EventEmitter<void>();

    subscriptionPlan: BaseSubscriptionPlan | undefined = undefined;
    showTooltip = false;

    mainFeatures: { title: string, icon: any }[] = [];
    secondaryFeatures: string[] = [];

    faUser = faUser;
    faCircleCheck = faCircleCheck;
    faGear = faGear;
    faIndustry = faIndustry;
    faWarehouse = faWarehouse;
    faTruck = faTruck;
    faUniversalAccess = faUniversalAccess;

    constructor(
        private planService: BaseSubscriptionPlanService
    ) {}

    ngOnInit(): void {
        this.subscriptionPlan = this.planService.getSubscriptionPlan(this.planTier ?? PlanTier.NONE); 
        this.mainFeatures = [
            { title: 'Products', icon: this.faGear },
            { title: 'Factories', icon: this.faIndustry },
            { title: 'Warehouses', icon: this.faWarehouse },
            { title: 'Suppliers', icon: this.faTruck },
            { title: 'Clients', icon: this.faUniversalAccess },
        ];
        this.secondaryFeatures = [
            "Supplier Orders", "Supplier Shipments", "Client Orders", "Client Shipments", "Factory Inventory Items", "Warehouse Inventory Items"
        ]
    }

    getMaxNumberString(maxNumber: number | undefined): string {
        if (maxNumber === undefined) return ""; 
        return maxNumber === -1 ? 'Unlimited' : maxNumber.toString();
    }

    
    triggerCustomizePlan() {
        this.customizePlan.emit();
    }
}
