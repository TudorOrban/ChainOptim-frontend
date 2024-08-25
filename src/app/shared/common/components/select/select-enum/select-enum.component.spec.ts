import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectEnumComponent } from './select-enum.component';

describe('SelectEnumComponent', () => {
  let component: SelectEnumComponent;
  let fixture: ComponentFixture<SelectEnumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectEnumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectEnumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
