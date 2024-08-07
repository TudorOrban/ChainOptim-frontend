import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryInventoryComponent } from './factory-inventory.component';

describe('FactoryInventoryComponent', () => {
  let component: FactoryInventoryComponent;
  let fixture: ComponentFixture<FactoryInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactoryInventoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FactoryInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
