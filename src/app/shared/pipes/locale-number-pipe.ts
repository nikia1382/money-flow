import { Pipe, PipeTransform, inject } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'localeNumber',
  standalone: true,
  pure: false,
})
export class LocaleNumberPipe implements PipeTransform {
  private readonly translate = inject(TranslateService);

  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return '';
    }

    const language = this.translate.currentLang();

    const locale = language === 'fa' ? 'fa-IR-u-nu-arabext' : 'en-US';

    return new Intl.NumberFormat(locale).format(value);
  }
}
