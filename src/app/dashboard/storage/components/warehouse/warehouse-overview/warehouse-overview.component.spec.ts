import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseOverviewComponent } from './warehouse-overview.component';

describe('WarehouseOverviewComponent', () => {
  let component: WarehouseOverviewComponent;
  let fixture: ComponentFixture<WarehouseOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WarehouseOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
