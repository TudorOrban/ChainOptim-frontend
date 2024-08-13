import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryGraphComponent } from './factory-graph.component';

describe('FactoryGraphComponent', () => {
  let component: FactoryGraphComponent;
  let fixture: ComponentFixture<FactoryGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactoryGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FactoryGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
