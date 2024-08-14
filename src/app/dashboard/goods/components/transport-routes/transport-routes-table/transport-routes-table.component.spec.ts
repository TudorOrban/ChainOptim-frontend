import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportRoutesTableComponent } from './transport-routes-table.component';

describe('TransportRoutesComponent', () => {
  let component: TransportRoutesTableComponent;
  let fixture: ComponentFixture<TransportRoutesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportRoutesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportRoutesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
