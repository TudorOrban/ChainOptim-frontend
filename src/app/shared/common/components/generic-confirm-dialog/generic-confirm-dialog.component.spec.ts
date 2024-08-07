import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericConfirmDialogComponent } from './generic-confirm-dialog.component';

describe('GenericConfirmDialogComponent', () => {
  let component: GenericConfirmDialogComponent;
  let fixture: ComponentFixture<GenericConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericConfirmDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenericConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
