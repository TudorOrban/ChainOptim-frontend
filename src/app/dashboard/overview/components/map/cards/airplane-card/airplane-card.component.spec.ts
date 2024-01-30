import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirplaneCardComponent } from './airplane-card.component';

describe('AirplaneCardComponent', () => {
  let component: AirplaneCardComponent;
  let fixture: ComponentFixture<AirplaneCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirplaneCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AirplaneCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
