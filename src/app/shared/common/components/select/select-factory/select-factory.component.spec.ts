import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFactoryComponent } from './select-factory.component';

describe('SelectFactoryComponent', () => {
  let component: SelectFactoryComponent;
  let fixture: ComponentFixture<SelectFactoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectFactoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
