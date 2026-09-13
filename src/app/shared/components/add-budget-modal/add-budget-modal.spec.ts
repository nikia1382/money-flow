import { TEST_PROVIDERS } from '@testing/test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBudgetModal } from './add-budget-modal';

describe('AddBudgetModal', () => {
  let component: AddBudgetModal;
  let fixture: ComponentFixture<AddBudgetModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [...TEST_PROVIDERS],
      imports: [AddBudgetModal],
    }).compileComponents();

    fixture = TestBed.createComponent(AddBudgetModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

