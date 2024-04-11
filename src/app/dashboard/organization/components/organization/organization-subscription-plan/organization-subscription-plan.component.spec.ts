import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationSubscriptionPlanComponent } from './organization-subscription-plan.component';

describe('OrganizationSubscriptionPlanComponent', () => {
  let component: OrganizationSubscriptionPlanComponent;
  let fixture: ComponentFixture<OrganizationSubscriptionPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationSubscriptionPlanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrganizationSubscriptionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
