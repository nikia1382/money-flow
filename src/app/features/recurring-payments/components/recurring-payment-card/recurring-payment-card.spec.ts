import { TEST_PROVIDERS } from '@testing/test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringPaymentCard } from './recurring-payment-card';

describe('RecurringPaymentCard', () => {
  let component: RecurringPaymentCard;
  let fixture: ComponentFixture<RecurringPaymentCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [...TEST_PROVIDERS],
      imports: [RecurringPaymentCard],
    }).compileComponents();

    fixture = TestBed.createComponent(RecurringPaymentCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('payment', {
  id: 1,
  title: 'Internet',
  category: 'Bills',
  amount: 300000,
  account: 'Main Account',
  frequency: 'monthly',
  nextPaymentDate: '2026-09-20',
  status: 'active',
});

fixture.detectChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

