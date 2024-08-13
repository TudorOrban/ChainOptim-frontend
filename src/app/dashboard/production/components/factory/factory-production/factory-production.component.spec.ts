import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryProductionComponent } from './factory-production.component';

describe('FactoryProductionComponent', () => {
  let component: FactoryProductionComponent;
  let fixture: ComponentFixture<FactoryProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactoryProductionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FactoryProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
