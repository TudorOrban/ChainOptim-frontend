import { Component, Input, OnInit } from '@angular/core';
import { Pricing, Product } from '../../../models/Product';
import { PricingService } from '../../../services/pricing.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faSave, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { GenericConfirmDialogComponent } from '../../../../../shared/common/components/generic-confirm-dialog/generic-confirm-dialog.component';
import { ConfirmDialogInput } from '../../../../../shared/common/models/confirmDialogTypes';
import { OperationOutcome, ToastInfo } from '../../../../../shared/common/components/toast-system/toastTypes';

@Component({
    selector: 'app-product-pricing',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, GenericConfirmDialogComponent],
    templateUrl: './product-pricing.component.html',
    styleUrl: './product-pricing.component.css'
})
export class ProductPricingComponent implements OnInit {
    @Input() product: Product | undefined = undefined;

    pricing: Pricing | undefined = undefined;

    isEditing = false;

    deleteDialogInput: ConfirmDialogInput = {
        dialogTitle: "Delete Pricing",
        dialogMessage: "Are you sure you want to delete this pricing?",
    };
    isConfirmDialogOpen = false;
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

    constructor(
        private pricingService: PricingService,
    ) {}

    ngOnInit(): void {
        if (!this.product) {
            return console.error("Product not set");
        }

        this.pricingService.getPricingByProductId(this.product.id).subscribe((pricing) => {
            console.log("Got pricing:", pricing);
            this.pricing = pricing;
        });
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
