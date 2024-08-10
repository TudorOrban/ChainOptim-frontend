import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeficitResolutionComponent } from './deficit-resolution.component';

describe('DeficitResolutionComponent', () => {
  let component: DeficitResolutionComponent;
  let fixture: ComponentFixture<DeficitResolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeficitResolutionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeficitResolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
