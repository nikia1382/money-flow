import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordPaymentModal } from './record-payment-modal';

describe('RecordPaymentModal', () => {
  let component: RecordPaymentModal;
  let fixture: ComponentFixture<RecordPaymentModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordPaymentModal],
    }).compileComponents();

    fixture = TestBed.createComponent(RecordPaymentModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
