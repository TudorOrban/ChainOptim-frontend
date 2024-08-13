import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStageOutputComponent } from './add-stage-output.component';

describe('AddStageOutputComponent', () => {
  let component: AddStageOutputComponent;
  let fixture: ComponentFixture<AddStageOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStageOutputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddStageOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
