import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseCardComponent } from './warehouse-card.component';

describe('WarehouseCardComponent', () => {
  let component: WarehouseCardComponent;
  let fixture: ComponentFixture<WarehouseCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WarehouseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
