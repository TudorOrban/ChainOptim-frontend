import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectStageComponent } from './select-stage.component';

describe('SelectStageComponent', () => {
  let component: SelectStageComponent;
  let fixture: ComponentFixture<SelectStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectStageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
