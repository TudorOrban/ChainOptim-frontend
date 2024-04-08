import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductEvaluationComponent } from './product-evaluation.component';

describe('ProductEvaluationComponent', () => {
  let component: ProductEvaluationComponent;
  let fixture: ComponentFixture<ProductEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductEvaluationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
