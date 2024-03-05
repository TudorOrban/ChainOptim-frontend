import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FallbackManagerComponent } from './fallback-manager.component';

describe('FallbackManagerComponent', () => {
  let component: FallbackManagerComponent;
  let fixture: ComponentFixture<FallbackManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FallbackManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FallbackManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
