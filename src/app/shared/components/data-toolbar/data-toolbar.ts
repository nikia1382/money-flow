import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  LucideAngularModule,
  Search,
  SlidersHorizontal
} from 'lucide-angular';

import {
  TranslatePipe
} from '@ngx-translate/core';

import {
  ToolbarFilter
} from './data-toolbar.model';


@Component({
  selector: 'app-data-toolbar',

  imports: [
    FormsModule,
    LucideAngularModule,
    TranslatePipe
  ],

  templateUrl: './data-toolbar.html',
  styleUrl: './data-toolbar.scss'
})
export class DataToolbar {

  @Input()
  searchValue = '';

  @Input()
  searchPlaceholderKey =
    'common.search';

  @Input()
  filters:
    ToolbarFilter[] = [];

  @Input()
  filterValues:
    Record<string, string> = {};


  @Output()
  searchValueChange =
    new EventEmitter<string>();

  @Output()
  filterChange =
    new EventEmitter<{
      key: string;
      value: string;
    }>();


  readonly Search = Search;

  readonly SlidersHorizontal =
    SlidersHorizontal;


  onSearchChange(
    value: string
  ): void {

    this.searchValueChange.emit(
      value
    );

  }


  onFilterChange(
    key: string,
    value: string
  ): void {

    this.filterChange.emit({
      key,
      value
    });

  }

}