import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateWarehouseComponent } from './update-warehouse.component';

describe('UpdateWarehouseComponent', () => {
  let component: UpdateWarehouseComponent;
  let fixture: ComponentFixture<UpdateWarehouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateWarehouseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
