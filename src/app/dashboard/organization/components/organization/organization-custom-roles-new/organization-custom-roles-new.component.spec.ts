import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationCustomRolesNewComponent } from './organization-custom-roles-new.component';

describe('OrganizationCustomRolesNewComponent', () => {
  let component: OrganizationCustomRolesNewComponent;
  let fixture: ComponentFixture<OrganizationCustomRolesNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationCustomRolesNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationCustomRolesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
