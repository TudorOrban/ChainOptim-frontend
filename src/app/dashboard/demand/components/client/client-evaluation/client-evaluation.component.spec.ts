import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEvaluationComponent } from './client-evaluation.component';

describe('ClientEvaluationComponent', () => {
  let component: ClientEvaluationComponent;
  let fixture: ComponentFixture<ClientEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientEvaluationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
