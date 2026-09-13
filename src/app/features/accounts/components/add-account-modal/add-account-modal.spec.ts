import { TEST_PROVIDERS } from '@testing/test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccountModal } from './add-account-modal';

describe('AddAccountModal', () => {
  let component: AddAccountModal;
  let fixture: ComponentFixture<AddAccountModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [...TEST_PROVIDERS],
      imports: [AddAccountModal],
    }).compileComponents();

    fixture = TestBed.createComponent(AddAccountModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

