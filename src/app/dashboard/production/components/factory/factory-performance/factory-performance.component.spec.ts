import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryPerformanceComponent } from './factory-performance.component';

describe('FactoryPerformanceComponent', () => {
  let component: FactoryPerformanceComponent;
  let fixture: ComponentFixture<FactoryPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactoryPerformanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FactoryPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
