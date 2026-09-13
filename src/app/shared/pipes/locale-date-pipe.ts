import {
  Pipe,
  PipeTransform,
  inject,
} from '@angular/core';

import {
  TranslateService,
} from '@ngx-translate/core';

@Pipe({
  name: 'localeDate',
  standalone: true,
  pure: false,
})
export class LocaleDatePipe
  implements PipeTransform {

  private readonly translate =
    inject(TranslateService);

  transform(
    value:
      | string
      | Date
      | null
      | undefined,
  ): string {

    if (!value) {
      return '';
    }

    const date =
      value instanceof Date
        ? value
        : new Date(
            /^\d{4}-\d{2}-\d{2}$/
              .test(value)
              ? `${value}T00:00:00`
              : value,
          );

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return '';
    }

    const isPersian =
      this.translate.currentLang() === 'fa';

    return new Intl.DateTimeFormat(
      isPersian
        ? 'fa-IR-u-ca-persian-nu-arabext'
        : 'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
    ).format(date);
  }
}