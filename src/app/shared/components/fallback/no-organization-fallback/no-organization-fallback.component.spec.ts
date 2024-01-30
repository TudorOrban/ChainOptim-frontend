import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoOrganizationFallbackComponent } from './no-organization-fallback.component';

describe('NoOrganizationFallbackComponent', () => {
  let component: NoOrganizationFallbackComponent;
  let fixture: ComponentFixture<NoOrganizationFallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoOrganizationFallbackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NoOrganizationFallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
