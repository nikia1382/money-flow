import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataToolbar } from './data-toolbar';

describe('DataToolbar', () => {
  let component: DataToolbar;
  let fixture: ComponentFixture<DataToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataToolbar],
    }).compileComponents();

    fixture = TestBed.createComponent(DataToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
