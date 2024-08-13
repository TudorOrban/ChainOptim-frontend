import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierShipmentsComponent } from './supplier-shipments.component';

describe('SupplierShipmentsComponent', () => {
  let component: SupplierShipmentsComponent;
  let fixture: ComponentFixture<SupplierShipmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierShipmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplierShipmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
