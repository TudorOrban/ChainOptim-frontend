import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectUnitOfMeasurementComponent } from '../../../../shared/common/components/select/select-unit-of-measurement/select-unit-of-measurement.component';
import { UnitOfMeasurement } from '../../models/UnitOfMeasurement';
import { StandardUnit, UnitMagnitude } from '../../../../shared/enums/unitEnums';
import { CreateProductDTO } from '../../models/Product';
import { User } from '../../../../core/user/model/user';
import { UserService } from '../../../../core/user/services/user.service';
import { FallbackManagerService } from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { OperationOutcome } from '../../../../shared/common/components/toast-system/toastTypes';
import { ToastService } from '../../../../shared/common/components/toast-system/toast.service';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectUnitOfMeasurementComponent],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent implements OnInit {
    currentUser: User | undefined = undefined;
    productForm: FormGroup = new FormGroup({});
    unitOfMeasurement: UnitOfMeasurement = { standardUnit: StandardUnit.METER, unitMagnitude: UnitMagnitude.BASE};
  
    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
        private userService: UserService,
        private fallbackManagerService: FallbackManagerService,
        private toastService: ToastService,
        private router: Router
    ) {}
  
    ngOnInit() {
        this.productForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            description: ['', [Validators.maxLength(200)]]
        });

        this.loadCurrentUser();
    }

    private loadCurrentUser() {
        this.userService
            .getCurrentUser()
            .subscribe({
                next: (user) => {
                    if (user) {
                        this.currentUser = user;
                    }
                    this.fallbackManagerService.updateLoading(false);
                },
                error: (error: Error) => {
                    this.fallbackManagerService.updateError(
                        error.message ?? ''
                    );
                    this.fallbackManagerService.updateLoading(false);
                },
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

        this.productService.createProduct(productDTO).subscribe(
            product => {
                this.toastService.addToast({ id: 123, title: 'Success', message: 'Product created successfully.', outcome: OperationOutcome.SUCCESS });
                this.router.navigate(['/dashboard/products', product.id]);
            },
            error => {
                this.toastService.addToast({ id: 123, title: 'Error', message: 'Product creation failed.', outcome: OperationOutcome.ERROR });
                console.error('Error creating product:', error);
            }
        );
    }

    private getProductDTO(): CreateProductDTO {
        const productDTO: CreateProductDTO = {
            name: this.productForm.value.name,
            description: this.productForm.value.description,
            unit: this.unitOfMeasurement,
            organizationId: this.currentUser?.organization?.id ?? 0
        };

        return productDTO;
    }
}