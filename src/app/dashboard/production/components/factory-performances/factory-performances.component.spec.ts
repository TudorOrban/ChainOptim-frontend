import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryPerformancesComponent } from './factory-performances.component';

describe('FactoryPerformancesComponent', () => {
  let component: FactoryPerformancesComponent;
  let fixture: ComponentFixture<FactoryPerformancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactoryPerformancesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FactoryPerformancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
