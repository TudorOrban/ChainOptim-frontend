import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTransportRouteComponent } from './update-transport-route.component';

describe('UpdateTransportRouteComponent', () => {
  let component: UpdateTransportRouteComponent;
  let fixture: ComponentFixture<UpdateTransportRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTransportRouteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTransportRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
