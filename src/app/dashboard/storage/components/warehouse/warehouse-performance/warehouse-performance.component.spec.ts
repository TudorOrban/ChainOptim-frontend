import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehousePerformanceComponent } from './warehouse-performance.component';

describe('WarehousePerformanceComponent', () => {
  let component: WarehousePerformanceComponent;
  let fixture: ComponentFixture<WarehousePerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehousePerformanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WarehousePerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
