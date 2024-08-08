import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOrCreateLocationComponent } from './select-or-create-location.component';

describe('SelectOrCreateLocationComponent', () => {
  let component: SelectOrCreateLocationComponent;
  let fixture: ComponentFixture<SelectOrCreateLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectOrCreateLocationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectOrCreateLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
