import { TestBed } from '@angular/core/testing';
import { Debts } from '../pages/debts/debts';


describe('Debts', () => {
  let service: Debts;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Debts);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
