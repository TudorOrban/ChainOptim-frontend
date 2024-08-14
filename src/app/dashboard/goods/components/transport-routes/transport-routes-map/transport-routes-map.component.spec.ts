import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportRoutesMapComponent } from './transport-routes-map.component';

describe('TransportRoutesMapComponent', () => {
  let component: TransportRoutesMapComponent;
  let fixture: ComponentFixture<TransportRoutesMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportRoutesMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportRoutesMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
