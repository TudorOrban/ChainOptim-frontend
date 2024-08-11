import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGraphComponent } from './product-graph.component';

describe('ProductGraphComponent', () => {
  let component: ProductGraphComponent;
  let fixture: ComponentFixture<ProductGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
