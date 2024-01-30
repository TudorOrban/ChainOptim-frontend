import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryCardComponent } from './factory-card.component';

describe('FactoryCardComponent', () => {
  let component: FactoryCardComponent;
  let fixture: ComponentFixture<FactoryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactoryCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FactoryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
