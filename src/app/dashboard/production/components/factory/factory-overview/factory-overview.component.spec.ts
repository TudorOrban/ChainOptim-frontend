import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryOverviewComponent } from './factory-overview.component';

describe('FactoryOverviewComponent', () => {
  let component: FactoryOverviewComponent;
  let fixture: ComponentFixture<FactoryOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactoryOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FactoryOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
