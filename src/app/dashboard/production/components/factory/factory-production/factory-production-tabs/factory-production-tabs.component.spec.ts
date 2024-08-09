import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryProductionTabsComponent } from './factory-production-tabs.component';

describe('FactoryProductionTabsComponent', () => {
  let component: FactoryProductionTabsComponent;
  let fixture: ComponentFixture<FactoryProductionTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactoryProductionTabsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FactoryProductionTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
