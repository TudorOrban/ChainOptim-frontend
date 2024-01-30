import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoriesComponent } from './factories.component';

describe('FactoriesComponent', () => {
  let component: FactoriesComponent;
  let fixture: ComponentFixture<FactoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FactoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
