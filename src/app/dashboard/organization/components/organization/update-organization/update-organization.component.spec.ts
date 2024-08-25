import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOrganizationComponent } from './update-organization.component';

describe('UpdateOrganizationComponent', () => {
  let component: UpdateOrganizationComponent;
  let fixture: ComponentFixture<UpdateOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateOrganizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
