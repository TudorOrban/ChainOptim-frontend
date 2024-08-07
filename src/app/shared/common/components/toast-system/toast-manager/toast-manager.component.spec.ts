import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastManagerComponent } from './toast-manager.component';

describe('ToastManagerComponent', () => {
  let component: ToastManagerComponent;
  let fixture: ComponentFixture<ToastManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToastManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
