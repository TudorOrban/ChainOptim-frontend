import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStageOutputComponent } from './update-stage-output.component';

describe('UpdateStageOutputComponent', () => {
  let component: UpdateStageOutputComponent;
  let fixture: ComponentFixture<UpdateStageOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateStageOutputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateStageOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
