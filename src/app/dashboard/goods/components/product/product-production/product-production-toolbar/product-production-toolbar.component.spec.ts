import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductProductionToolbarComponent } from './product-production-toolbar.component';

describe('ProductProductionToolbarComponent', () => {
  let component: ProductProductionToolbarComponent;
  let fixture: ComponentFixture<ProductProductionToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductProductionToolbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductProductionToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
