import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateComponentComponent } from './update-component.component';

describe('UpdateComponentComponent', () => {
  let component: UpdateComponentComponent;
  let fixture: ComponentFixture<UpdateComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
