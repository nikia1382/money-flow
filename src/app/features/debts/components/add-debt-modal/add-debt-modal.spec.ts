import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDebtModal } from './add-debt-modal';

describe('AddDebtModal', () => {
  let component: AddDebtModal;
  let fixture: ComponentFixture<AddDebtModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDebtModal],
    }).compileComponents();

    fixture = TestBed.createComponent(AddDebtModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
