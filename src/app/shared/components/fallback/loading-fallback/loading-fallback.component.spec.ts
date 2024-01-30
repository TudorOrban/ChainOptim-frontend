import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingFallbackComponent } from './loading-fallback.component';

describe('LoadingFallbackComponent', () => {
  let component: LoadingFallbackComponent;
  let fixture: ComponentFixture<LoadingFallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingFallbackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoadingFallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
