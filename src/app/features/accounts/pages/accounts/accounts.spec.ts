import { TEST_PROVIDERS } from '@testing/test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Accounts } from './accounts';

describe('Accounts', () => {
  let component: Accounts;
  let fixture: ComponentFixture<Accounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [...TEST_PROVIDERS],
      imports: [Accounts],
    }).compileComponents();

    fixture = TestBed.createComponent(Accounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

