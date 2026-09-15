import {
  inject,
  Injectable,
  signal,
} from '@angular/core';

import {
  HttpClient,
} from '@angular/common/http';

import {
  TranslateService,
} from '@ngx-translate/core';

import {
  ToastService,
} from '../../../shared/services/toast';

export type AppLanguage =
  | 'en'
  | 'fa';

export type AppAppearance =
  | 'light'
  | 'dark';

export type AppCurrency =
  | 'Toman'
  | 'USD'
  | 'EUR';

export interface UserSettings {
  language: AppLanguage;
  appearance: AppAppearance;
  currency: AppCurrency;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  /* =========================
     Dependencies
  ========================= */

  private readonly http =
    inject(HttpClient);

  private readonly translate =
    inject(TranslateService);

  private readonly toast =
    inject(ToastService);

  /* =========================
     API
  ========================= */

  private readonly apiUrl =
    'http://localhost:8080/api/settings';

  /* =========================
     State
  ========================= */

  readonly language =
    signal<AppLanguage>('en');

  readonly appearance =
    signal<AppAppearance>(
      'light',
    );

  readonly currency =
    signal<AppCurrency>(
      'Toman',
    );

  readonly isLoading =
    signal(false);

  readonly isSaving =
    signal(false);

  /* =========================
     GET
  ========================= */

  loadSettings(): void {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);

    this.http
      .get<UserSettings>(
        this.apiUrl,
      )
      .subscribe({
        next: (settings) => {
          this.applySettings(
            settings,
          );

          this.isLoading.set(
            false,
          );
        },

        error: (error) => {
          this.isLoading.set(
            false,
          );

          console.error(
            'Failed to load settings',
            error,
          );

          this.toast.error(
            this.translate.instant(
              'settings.toast.loadFailed',
            ),
          );
        },
      });
  }

  /* =========================
     Language
  ========================= */

  setLanguage(
    language: AppLanguage,
  ): void {
    this.saveSettings({
      language,
      appearance:
        this.appearance(),
      currency:
        this.currency(),
    });
  }

  /* =========================
     Appearance
  ========================= */

  setAppearance(
    appearance:
      AppAppearance,
  ): void {
    this.saveSettings({
      language:
        this.language(),
      appearance,
      currency:
        this.currency(),
    });
  }

  /* =========================
     Currency
  ========================= */

  setCurrency(
    currency: AppCurrency,
  ): void {
    this.saveSettings({
      language:
        this.language(),
      appearance:
        this.appearance(),
      currency,
    });
  }

  /* =========================
     PUT
  ========================= */

  private saveSettings(
    settings: UserSettings,
  ): void {
    if (this.isSaving()) {
      return;
    }

    const previousSettings:
      UserSettings = {
        language:
          this.language(),

        appearance:
          this.appearance(),

        currency:
          this.currency(),
      };

    /*
     * برای واکنش سریع UI، تنظیمات
     * ابتدا موقتاً اعمال می‌شوند.
     */
    this.applySettings(
      settings,
    );

    this.isSaving.set(true);

    this.http
      .put<UserSettings>(
        this.apiUrl,
        settings,
      )
      .subscribe({
        next: (savedSettings) => {
          this.applySettings(
            savedSettings,
          );

          this.isSaving.set(
            false,
          );

          this.toast.success(
            this.translate.instant(
              'settings.toast.saved',
            ),
          );
        },

        error: (error) => {
          /*
           * اگر ذخیره شکست خورد،
           * تنظیمات قبلی بازگردانده می‌شوند.
           */
          this.applySettings(
            previousSettings,
          );

          this.isSaving.set(
            false,
          );

          console.error(
            'Failed to save settings',
            error,
          );

          this.toast.error(
            this.translate.instant(
              'settings.toast.saveFailed',
            ),
          );
        },
      });
  }

  /* =========================
     Apply
  ========================= */

  private applySettings(
    settings: UserSettings,
  ): void {
    this.language.set(
      settings.language,
    );

    this.appearance.set(
      settings.appearance,
    );

    this.currency.set(
      settings.currency,
    );

    this.translate.use(
      settings.language,
    );

    document.documentElement.lang =
      settings.language;

    document.documentElement.dir =
      settings.language === 'fa'
        ? 'rtl'
        : 'ltr';

    document.documentElement
      .classList
      .toggle(
        'dark',
        settings.appearance ===
          'dark',
      );

    /*
     * LocalStorage فقط Cache است.
     * منبع اصلی اطلاعات Backend است.
     */
    localStorage.setItem(
      'language',
      settings.language,
    );

    localStorage.setItem(
      'appearance',
      settings.appearance,
    );

    localStorage.setItem(
      'currency',
      settings.currency,
    );
  }
}