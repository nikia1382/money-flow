import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetProgress } from './budget-progress';

describe('BudgetProgress', () => {
  let component: BudgetProgress;
  let fixture: ComponentFixture<BudgetProgress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetProgress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetProgress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
