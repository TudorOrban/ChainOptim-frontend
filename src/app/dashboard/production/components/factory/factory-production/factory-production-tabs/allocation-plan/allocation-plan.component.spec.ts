import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationPlanComponent } from './allocation-plan.component';

describe('AllocationPlanComponent', () => {
  let component: AllocationPlanComponent;
  let fixture: ComponentFixture<AllocationPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllocationPlanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllocationPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
