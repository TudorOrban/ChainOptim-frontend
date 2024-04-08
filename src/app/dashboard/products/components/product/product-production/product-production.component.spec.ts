import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductProductionComponent } from './product-production.component';

describe('ProductProductionComponent', () => {
  let component: ProductProductionComponent;
  let fixture: ComponentFixture<ProductProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductProductionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
