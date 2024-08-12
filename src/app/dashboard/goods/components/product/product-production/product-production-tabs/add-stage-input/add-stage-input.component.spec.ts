import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStageInputComponent } from './add-stage-input.component';

describe('AddStageInputComponent', () => {
  let component: AddStageInputComponent;
  let fixture: ComponentFixture<AddStageInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStageInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddStageInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
