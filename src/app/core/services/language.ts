import { Injectable, inject, signal } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translate = inject(TranslateService);

  readonly language = signal<'en' | 'fa'>(this.getSavedLanguage());

  initialize(): void {
    const language = this.language();

    this.translate.use(language);

    this.applyDirection(language);
  }

  setLanguage(language: 'en' | 'fa'): void {
    this.language.set(language);

    localStorage.setItem('language', language);

    this.translate.use(language);

    this.applyDirection(language);
  }

  private getSavedLanguage(): 'en' | 'fa' {
    const savedLanguage = localStorage.getItem('language');

    return savedLanguage === 'en' ? 'en' : 'fa';
  }

  private applyDirection(language: 'en' | 'fa'): void {
    document.documentElement.lang = language;

    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
  }
}
