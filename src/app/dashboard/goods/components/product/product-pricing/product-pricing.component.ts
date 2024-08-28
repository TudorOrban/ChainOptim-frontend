import { Component, Input, OnInit } from '@angular/core';
import { Pricing, Product } from '../../../models/Product';
import { PricingService } from '../../../services/pricing.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faSave, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { GenericConfirmDialogComponent } from '../../../../../shared/common/components/generic-confirm-dialog/generic-confirm-dialog.component';
import { ConfirmDialogInput } from '../../../../../shared/common/models/confirmDialogTypes';
import { OperationOutcome, ToastInfo } from '../../../../../shared/common/components/toast-system/toastTypes';
import { FormsModule } from '@angular/forms';
import { UIUtilService } from '../../../../../shared/common/services/uiutil.service';

@Component({
    selector: 'app-product-pricing',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, FormsModule, GenericConfirmDialogComponent],
    templateUrl: './product-pricing.component.html',
    styleUrl: './product-pricing.component.css'
})
export class ProductPricingComponent implements OnInit {
    @Input() product: Product | undefined = undefined;

    pricing: Pricing | undefined = undefined;

    isEditing: boolean = false;
    maxSliderValue: number = 1000;
    quantity: number = 0;
    pricePerUnit: number = 0;
    totalPrice: number = 0;

    deleteDialogInput: ConfirmDialogInput = {
        dialogTitle: "Delete Pricing",
        dialogMessage: "Are you sure you want to delete this pricing?",
    };
    isConfirmDialogOpen: boolean = false;
    toastInfo: ToastInfo = {
        id: 1,
        title: "Pricing deleted",
        message: "The pricing has been deleted successfully",
        outcome: OperationOutcome.SUCCESS
    };
    
    faEdit = faEdit;
    faTimes = faTimes;
    faSave = faSave;
    faTrash = faTrash;

    uiUtilService: UIUtilService;

    constructor(
        private pricingService: PricingService,
        uiUtilService: UIUtilService
    ) {
        this.uiUtilService = uiUtilService;
    }

    ngOnInit(): void {
        if (!this.product) {
            return console.error("Product not set");
        }

        this.pricingService.getPricingByProductId(this.product.id).subscribe((pricing) => {
            this.pricing = pricing;
            console.log("Pricing:", pricing);
            this.updateMaxSliderValue();
        });
    }

    private updateMaxSliderValue(): void {
        const pricePerVolumeEntries = Object.entries(this.pricing?.productPricing.pricePerVolume ?? {});
        const keys = pricePerVolumeEntries.map(([key, _]) => Number(key));
        const maxKey = Math.max(...keys);
        this.maxSliderValue = maxKey * 2; // Set slider range to be double the highest pricePerVolume key
        console.log("Max slider value:", this.maxSliderValue);
    }

    updatePricing(): void {
        let totalPrice = this.calculatePrice(this.quantity);
        this.totalPrice = parseFloat(totalPrice.toFixed(2));
        this.pricePerUnit = parseFloat((this.quantity !== 0 ? this.totalPrice / this.quantity : (this.pricing?.productPricing.pricePerUnit ?? 0)).toFixed(2));
    }

    private calculatePrice(quantity: number): number {
        const pricePerVolumeEntries = Object.entries(this.pricing?.productPricing.pricePerVolume ?? {});
        const pricePerVolume = new Map<number, number>(
          pricePerVolumeEntries.map(([key, value]) => [Number(key), value] as [number, number])
        );
    
        if (pricePerVolume.size === 0) {
            return quantity * (this.pricing?.productPricing.pricePerUnit ?? 0);
        }
    
        let closestVolume = Array.from(pricePerVolume.keys()).reduce((prev, curr) => 
          curr <= quantity && curr > prev ? curr : prev, 0
        );
    
        return quantity * (pricePerVolume.get(closestVolume) ?? this.pricing?.productPricing.pricePerUnit ?? 0);
    }
    

    onPriceChange(): void {
        console.log("Price changed:");
    }

    openConfirmDeleteDialog(): void {
        console.log("Open confirm dialog");
        this.isConfirmDialogOpen = true;
    }

    cancelDeletePricing(): void {
        console.log("Cancel delete pricing");
        this.isConfirmDialogOpen = false;
    }

    handleDeletePricing(): void {
        console.log("Delete pricing");
        this.isConfirmDialogOpen = false;
    }

    handleEditPricing(): void {
        console.log("Edit pricing");
        this.isEditing = true;
    }

    handleSavePricing(): void {
        console.log("Save pricing");
    }

    handleCancelEditPricing(): void {
        console.log("Cancel edit pricing");
        this.isEditing = false;
    }
}
