import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryProductionToolbarComponent } from './factory-production-toolbar.component';

describe('FactoryProductionToolbarComponent', () => {
  let component: FactoryProductionToolbarComponent;
  let fixture: ComponentFixture<FactoryProductionToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactoryProductionToolbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FactoryProductionToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
