import { Component, Input, OnInit } from '@angular/core';
import { Pricing, Product } from '../../../models/Product';
import { PricingService } from '../../../services/pricing.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faPlus, faSave, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
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
    maxTierQuantity: number = 1000;
    priceRanges: { min: number; max: number; price: number; isEdited?: boolean }[] = [];
    editedRanges: { min: number; max: number; price: number; isEdited?: boolean }[] = [];
    
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
    faPlus = faPlus;
    faTrash = faTrash;

    uiUtilService: UIUtilService;

    constructor(
        private readonly pricingService: PricingService,
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
            this.updateMaxTierQuantity();
            this.preparePriceRanges();
        });
    }

    private updateMaxTierQuantity(): void {
        const pricePerVolumeEntries = Object.entries(this.pricing?.productPricing.pricePerVolume ?? {});
        const keys = pricePerVolumeEntries.map(([key, _]) => Number(key));
        this.maxTierQuantity = Math.max(...keys);
    }

    private preparePriceRanges(): void {
        const pricePerVolumeEntries = Object.entries(this.pricing?.productPricing.pricePerVolume ?? {});
        const sortedEntries = pricePerVolumeEntries.map(([key, value]) => [parseFloat(key), value])
                                                    .sort((a, b) => a[0] - b[0]);
    
        this.priceRanges = sortedEntries.map((current, index, array) => {
            const [currentQuantity, currentPrice] = current;
            const previousQuantity = index > 0 ? array[index - 1][0] : 0;
            return {
                min: previousQuantity,
                max: currentQuantity,
                price: currentPrice,
                isEdited: false
            };
        });
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

    // Delete
    openConfirmDeleteDialog(): void {
        this.isConfirmDialogOpen = true;
    }

    cancelDeletePricing(): void {
        this.isConfirmDialogOpen = false;
    }

    handleDeletePricing(): void {
        this.isConfirmDialogOpen = false;
        // TODO: Implement delete pricing
    }

    // Edit
    handleEditPricing(): void {
        console.log("Edit pricing");
        this.isEditing = true;
        this.editedRanges = this.priceRanges.map((range) => ({ ...range }));
    }

    removeTier(index: number): void {
        console.log("Remove tier", index);
        this.editedRanges.splice(index, 1);
    }

    editTier(index: number): void {
        console.log("Edit tier", index);
        this.editedRanges[index].isEdited = true;
    }

    addTier(): void {
        console.log("Add tier");
        this.editedRanges.push({ min: this.maxTierQuantity, max: this.maxTierQuantity + 1, price: 0 });
        this.updateMaxTierQuantity();
    }

    saveTier(index: number): void {
        console.log("Save tier", index);
        this.editedRanges[index].isEdited = false;
    }

    cancelEditTier(index: number): void {
        console.log("Cancel edit tier", index);
        this.editedRanges[index] = { ...this.priceRanges[index] };
        this.editedRanges[index].isEdited = false;
    }

    handleSavePricing(): void {
        console.log("Save pricing");
        // TODO: Implement save pricing
    }

    handleCancelEditPricing(): void {
        this.isEditing = false;
    }
}
