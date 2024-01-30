import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoResultsFallbackComponent } from './no-results-fallback.component';

describe('NoResultsFallbackComponent', () => {
  let component: NoResultsFallbackComponent;
  let fixture: ComponentFixture<NoResultsFallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoResultsFallbackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NoResultsFallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
