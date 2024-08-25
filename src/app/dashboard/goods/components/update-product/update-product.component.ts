import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectUnitOfMeasurementComponent } from '../../../../shared/common/components/select/select-unit-of-measurement/select-unit-of-measurement.component';
import { UnitOfMeasurement } from '../../models/UnitOfMeasurement';
import { StandardUnit, UnitMagnitude } from '../../../../shared/enums/unitEnums';
import { Product, UpdateProductDTO } from '../../models/Product';
import { User } from '../../../../core/user/model/user';
import { UserService } from '../../../../core/auth/services/user.service';
import { FallbackManagerService } from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationOutcome } from '../../../../shared/common/components/toast-system/toastTypes';
import { ToastService } from '../../../../shared/common/components/toast-system/toast.service';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectUnitOfMeasurementComponent],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css'
})
export class UpdateProductComponent implements OnInit {
    productId: number | undefined = undefined;
    product: Product | undefined = undefined;
    currentUser: User | undefined = undefined;
    productForm: FormGroup = new FormGroup({});
    unitOfMeasurement: UnitOfMeasurement = { standardUnit: StandardUnit.METER, unitMagnitude: UnitMagnitude.BASE};
  
    constructor(
        private productService: ProductService,
        private userService: UserService,
        private fallbackManagerService: FallbackManagerService,
        private toastService: ToastService,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
    ) {}
  
    ngOnInit() {
        this.productForm = this.fb.group({
            name: ["", [Validators.required, Validators.minLength(3)]],
            description: ["", [Validators.maxLength(200)]]
        });

        this.loadUser();
        this.loadProduct();
    }

    private loadUser() {
        this.userService.getCurrentUser().subscribe((user) => {
            if (!user) {
                return;
            }
            this.currentUser = user;
        });
    }

    private loadProduct() {
        this.route.paramMap.subscribe((params) => {
            this.productId = parseInt(params.get('productId') ?? "");
            if (!this.productId) {
                return;
            }

            this.productService
                .getProductById(Number(this.productId))
                .subscribe({
                    next: (product) => {
                        console.log('PRODUCT', product);
                        this.product = product;
                        this.productForm.patchValue({
                            name: product.name,
                            description: product.description ?? ''
                        });
                        this.fallbackManagerService.updateLoading(false);
                    },

                    error: (error: Error) => {
                        this.fallbackManagerService.updateError(
                            error.message ?? ''
                        );
                        this.fallbackManagerService.updateLoading(false);
                    },
                });
        });
    }

    hasError(controlName: string, errorName: string): boolean {
        const control = this.productForm.get(controlName);
        return (control?.hasError(errorName) && control?.touched) || false;
    }
    
    onUnitChange(unitData: UnitOfMeasurement) {
        this.unitOfMeasurement = unitData;
    }

    onSubmit(): void {
        if (!this.currentUser?.organization?.id) {
            console.error("Missing user");
            return;
        }

        const productDTO = this.getProductDTO();        

        this.productService.updateProduct(productDTO).subscribe(
            product => {
                this.toastService.addToast({ id: 123, title: 'Success', message: 'Product updated successfully.', outcome: OperationOutcome.SUCCESS });
                this.router.navigate(['/dashboard/products', product.id]);
            },
            error => {
                this.toastService.addToast({ id: 123, title: 'Error', message: 'Product update failed.', outcome: OperationOutcome.ERROR });
                console.error('Error updating product:', error);
            }
        );
    }

    private getProductDTO(): UpdateProductDTO {
        const productDTO: UpdateProductDTO = {
            id: this.productId ?? 0,
            name: this.productForm.value.name,
            description: this.productForm.value.description,
            newUnit: this.unitOfMeasurement,
            organizationId: this.currentUser?.organization?.id ?? 0
        };

        return productDTO;
    }
}