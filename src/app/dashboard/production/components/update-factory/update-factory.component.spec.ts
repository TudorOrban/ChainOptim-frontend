import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFactoryComponent } from './update-factory.component';

describe('UpdateFactoryComponent', () => {
  let component: UpdateFactoryComponent;
  let fixture: ComponentFixture<UpdateFactoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateFactoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
