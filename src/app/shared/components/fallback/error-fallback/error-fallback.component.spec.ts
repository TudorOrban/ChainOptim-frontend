import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorFallbackComponent } from './error-fallback.component';

describe('ErrorFallbackComponent', () => {
  let component: ErrorFallbackComponent;
  let fixture: ComponentFixture<ErrorFallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorFallbackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ErrorFallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
