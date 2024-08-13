import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFactoryStageComponent } from './select-factory-stage.component';

describe('SelectFactoryStageComponent', () => {
  let component: SelectFactoryStageComponent;
  let fixture: ComponentFixture<SelectFactoryStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectFactoryStageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectFactoryStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
