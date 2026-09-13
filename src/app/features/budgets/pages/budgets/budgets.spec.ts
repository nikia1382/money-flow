import {
  TestBed,
} from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../../../testing/test-providers';
import { BudgetsService } from '../../services/budgets';


describe('BudgetsService', () => {
  let service: BudgetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...TEST_PROVIDERS,
      ],
    });

    service =
      TestBed.inject(
        BudgetsService,
      );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});