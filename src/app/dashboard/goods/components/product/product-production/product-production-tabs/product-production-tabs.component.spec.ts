import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductProductionTabsComponent } from './product-production-tabs.component';

describe('ProductProductionTabsComponent', () => {
  let component: ProductProductionTabsComponent;
  let fixture: ComponentFixture<ProductProductionTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductProductionTabsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductProductionTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
