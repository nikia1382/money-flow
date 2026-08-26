import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecurringPaymentModal } from './add-recurring-payment-modal';

describe('AddRecurringPaymentModal', () => {
  let component: AddRecurringPaymentModal;
  let fixture: ComponentFixture<AddRecurringPaymentModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRecurringPaymentModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRecurringPaymentModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
