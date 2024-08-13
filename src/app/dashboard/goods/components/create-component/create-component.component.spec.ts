import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateComponentComponent } from './create-component.component';

describe('CreateComponentComponent', () => {
  let component: CreateComponentComponent;
  let fixture: ComponentFixture<CreateComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
