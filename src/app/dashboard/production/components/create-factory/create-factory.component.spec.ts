import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFactoryComponent } from './create-factory.component';

describe('CreateFactoryComponent', () => {
  let component: CreateFactoryComponent;
  let fixture: ComponentFixture<CreateFactoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateFactoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
