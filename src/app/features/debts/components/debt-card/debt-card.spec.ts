import { TEST_PROVIDERS } from '@testing/test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtCard } from './debt-card';

describe('DebtCard', () => {
  let component: DebtCard;
  let fixture: ComponentFixture<DebtCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        ...TEST_PROVIDERS,
      ],
      imports: [
        DebtCard,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DebtCard);
    component = fixture.componentInstance;

    component.debt = {
      id: 1,
      personName: 'Test Person',
      amount: 1_000_000,
      type: 'iOwe',
      status: 'active',
      dueDate: '2026-10-01',
      description: '',
    } as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});