import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectUnitOfMeasurementComponent } from './select-unit-of-measurement.component';

describe('SelectUnitOfMeasurementComponent', () => {
  let component: SelectUnitOfMeasurementComponent;
  let fixture: ComponentFixture<SelectUnitOfMeasurementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectUnitOfMeasurementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectUnitOfMeasurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
