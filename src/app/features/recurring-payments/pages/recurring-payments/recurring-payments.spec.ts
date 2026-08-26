import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringPayments } from './recurring-payments';

describe('RecurringPayments', () => {
  let component: RecurringPayments;
  let fixture: ComponentFixture<RecurringPayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecurringPayments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecurringPayments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
