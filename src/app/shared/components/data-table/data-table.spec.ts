import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {
  DataTable,
} from './data-table';

import {
  TEST_PROVIDERS,
} from '../../../testing/test-providers';

describe('DataTable', () => {
  let component: DataTable<any>;
  let fixture: ComponentFixture<DataTable<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DataTable,
      ],

      providers: [
        ...TEST_PROVIDERS,
      ],
    }).compileComponents();

    fixture =
      TestBed.createComponent(DataTable);

    component =
      fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});