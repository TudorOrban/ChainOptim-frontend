import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientShipmentsComponent } from './client-shipments.component';

describe('ClientShipmentsComponent', () => {
  let component: ClientShipmentsComponent;
  let fixture: ComponentFixture<ClientShipmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientShipmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientShipmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
