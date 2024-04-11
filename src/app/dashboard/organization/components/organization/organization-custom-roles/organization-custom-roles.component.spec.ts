import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationCustomRolesComponent } from './organization-custom-roles.component';

describe('OrganizationCustomRolesComponent', () => {
  let component: OrganizationCustomRolesComponent;
  let fixture: ComponentFixture<OrganizationCustomRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationCustomRolesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrganizationCustomRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
