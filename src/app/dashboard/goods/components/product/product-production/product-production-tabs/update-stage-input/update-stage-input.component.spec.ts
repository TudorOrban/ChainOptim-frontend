import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStageInputComponent } from './update-stage-input.component';

describe('UpdateStageInputComponent', () => {
  let component: UpdateStageInputComponent;
  let fixture: ComponentFixture<UpdateStageInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateStageInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateStageInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
