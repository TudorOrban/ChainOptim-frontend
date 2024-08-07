import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectUnitOfMeasurementComponent } from '../../../../shared/common/components/select/select-unit-of-measurement/select-unit-of-measurement.component';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectUnitOfMeasurementComponent],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent implements OnInit {
    productForm: FormGroup = new FormGroup({});
  
    constructor(private fb: FormBuilder) {}
  
    ngOnInit() {
        this.productForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            description: ['', [Validators.required, Validators.maxLength(200)]]
        });
    }

    hasError(controlName: string, errorName: string): boolean {
        const control = this.productForm.get(controlName);
        return (control?.hasError(errorName) && control?.touched) || false;
    }
    
    onSubmit(): void {
        console.log('Form data:', this.productForm.value);
    }
}