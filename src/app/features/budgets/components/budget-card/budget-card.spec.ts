import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {
  BudgetCard,
} from './budget-card';

import {
  TEST_PROVIDERS,
} from '@testing/test-providers';

describe('BudgetCard', () => {
  let component: BudgetCard;
  let fixture: ComponentFixture<BudgetCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BudgetCard,
      ],

      providers: [
        ...TEST_PROVIDERS,
      ],
    }).compileComponents();

    fixture =
      TestBed.createComponent(
        BudgetCard,
      );

    component =
      fixture.componentInstance;

    component.budget = {
      id: 1,
      category: 'Bills',
      limit: 2_000_000,
      spent: 500_000,
      month: '2026-09',
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});