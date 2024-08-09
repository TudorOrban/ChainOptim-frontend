import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFactoryStageComponent } from './update-factory-stage.component';

describe('UpdateFactoryStageComponent', () => {
  let component: UpdateFactoryStageComponent;
  let fixture: ComponentFixture<UpdateFactoryStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateFactoryStageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateFactoryStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
