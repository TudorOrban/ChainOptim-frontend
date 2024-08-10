import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionHistoryComponent } from './production-history.component';

describe('ProductionHistoryComponent', () => {
  let component: ProductionHistoryComponent;
  let fixture: ComponentFixture<ProductionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
