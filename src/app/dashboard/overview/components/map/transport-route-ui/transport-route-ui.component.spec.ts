import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportRouteUIComponent } from './transport-route-ui.component';

describe('TransportRouteUIComponent', () => {
  let component: TransportRouteUIComponent;
  let fixture: ComponentFixture<TransportRouteUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportRouteUIComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransportRouteUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
