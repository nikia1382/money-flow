import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringPaymentCard } from './recurring-payment-card';

describe('RecurringPaymentCard', () => {
  let component: RecurringPaymentCard;
  let fixture: ComponentFixture<RecurringPaymentCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecurringPaymentCard],
    }).compileComponents();

    fixture = TestBed.createComponent(RecurringPaymentCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
