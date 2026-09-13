import { TEST_PROVIDERS } from '@testing/test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Premium } from './premium';

describe('Premium', () => {
  let component: Premium;
  let fixture: ComponentFixture<Premium>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [...TEST_PROVIDERS],
      imports: [Premium],
    }).compileComponents();

    fixture = TestBed.createComponent(Premium);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

