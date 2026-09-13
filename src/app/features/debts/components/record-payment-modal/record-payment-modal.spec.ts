import { TEST_PROVIDERS } from '@testing/test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordPaymentModal } from './record-payment-modal';

describe('RecordPaymentModal', () => {
  let component: RecordPaymentModal;
  let fixture: ComponentFixture<RecordPaymentModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [...TEST_PROVIDERS],
      imports: [RecordPaymentModal],
    }).compileComponents();

    fixture = TestBed.createComponent(RecordPaymentModal);
    component = fixture.componentInstance;
    fixture = TestBed.createComponent(RecordPaymentModal);
component = fixture.componentInstance;

fixture.componentRef.setInput('debt', {
  id: 1,
  personName: 'Test Person',
  amount: 1_000_000,
  remainingAmount: 500_000,
  type: 'iOwe',
  status: 'active',
  dueDate: '2026-10-01',
});

fixture.detectChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

