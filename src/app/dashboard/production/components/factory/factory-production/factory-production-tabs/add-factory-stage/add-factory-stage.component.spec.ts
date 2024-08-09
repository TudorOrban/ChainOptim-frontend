import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFactoryStageComponent } from './add-factory-stage.component';

describe('AddFactoryStageComponent', () => {
  let component: AddFactoryStageComponent;
  let fixture: ComponentFixture<AddFactoryStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFactoryStageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddFactoryStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
