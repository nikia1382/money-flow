import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtCard } from './debt-card';

describe('DebtCard', () => {
  let component: DebtCard;
  let fixture: ComponentFixture<DebtCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebtCard],
    }).compileComponents();

    fixture = TestBed.createComponent(DebtCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
