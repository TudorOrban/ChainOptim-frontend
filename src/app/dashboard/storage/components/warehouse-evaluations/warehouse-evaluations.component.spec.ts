import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseEvaluationsComponent } from './warehouse-evaluations.component';

describe('WarehouseEvaluationsComponent', () => {
  let component: WarehouseEvaluationsComponent;
  let fixture: ComponentFixture<WarehouseEvaluationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseEvaluationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WarehouseEvaluationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
