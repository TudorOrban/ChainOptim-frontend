import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPerformanceComponent } from './supplier-performance.component';

describe('SupplierPerformanceComponent', () => {
  let component: SupplierPerformanceComponent;
  let fixture: ComponentFixture<SupplierPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierPerformanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplierPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
