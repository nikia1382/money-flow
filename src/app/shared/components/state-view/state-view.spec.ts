import { TEST_PROVIDERS } from '@testing/test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateView } from './state-view';

describe('StateView', () => {
  let component: StateView;
  let fixture: ComponentFixture<StateView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [...TEST_PROVIDERS],
      imports: [StateView],
    }).compileComponents();

    fixture = TestBed.createComponent(StateView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

