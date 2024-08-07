import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierOrdersComponent } from './supplier-orders.component';

describe('SupplierOrdersComponent', () => {
  let component: SupplierOrdersComponent;
  let fixture: ComponentFixture<SupplierOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierOrdersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplierOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
