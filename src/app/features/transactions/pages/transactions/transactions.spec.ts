import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pagination } from '../../../../shared/components/pagination/pagination';

describe('Pagination', () => {
  let component: Pagination;

  let fixture: ComponentFixture<Pagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagination],
    }).compileComponents();

    fixture = TestBed.createComponent(Pagination);

    component = fixture.componentInstance;

    component.totalItems = 25;

    component.pageSize = 10;

    component.currentPage = 1;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total pages', () => {
    expect(component.totalPages).toBe(3);
  });

  it('should calculate start and end items', () => {
    expect(component.startItem).toBe(1);

    expect(component.endItem).toBe(10);
  });

  it('should emit page change', () => {
    spyOn(component.pageChange, 'emit');

    component.goToPage(2);

    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });
});
