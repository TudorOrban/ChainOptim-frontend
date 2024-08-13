import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPerformancesComponent } from './client-performances.component';

describe('ClientPerformancesComponent', () => {
  let component: ClientPerformancesComponent;
  let fixture: ComponentFixture<ClientPerformancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientPerformancesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientPerformancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
