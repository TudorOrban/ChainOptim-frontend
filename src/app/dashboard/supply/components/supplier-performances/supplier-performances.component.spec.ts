import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPerformancesComponent } from './supplier-performances.component';

describe('SupplierPerformancesComponent', () => {
  let component: SupplierPerformancesComponent;
  let fixture: ComponentFixture<SupplierPerformancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierPerformancesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplierPerformancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
