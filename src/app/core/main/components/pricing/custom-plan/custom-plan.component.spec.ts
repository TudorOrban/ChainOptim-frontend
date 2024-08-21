import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPlanComponent } from './custom-plan.component';

describe('CustomPlanComponent', () => {
  let component: CustomPlanComponent;
  let fixture: ComponentFixture<CustomPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomPlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
