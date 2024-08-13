import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierOverviewComponent } from './supplier-overview.component';

describe('SupplierOverviewComponent', () => {
  let component: SupplierOverviewComponent;
  let fixture: ComponentFixture<SupplierOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplierOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
