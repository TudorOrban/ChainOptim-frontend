import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApexChartComponent } from './apex-chart.component';

describe('ApexChartComponent', () => {
  let component: ApexChartComponent;
  let fixture: ComponentFixture<ApexChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApexChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApexChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
