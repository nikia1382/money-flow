import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransactionModal } from './add-transaction-modal';

describe('AddTransactionModal', () => {
  let component: AddTransactionModal;
  let fixture: ComponentFixture<AddTransactionModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTransactionModal],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTransactionModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
