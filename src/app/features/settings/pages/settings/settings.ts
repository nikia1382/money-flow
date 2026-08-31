import { Component, inject, signal } from '@angular/core';
import { Languages, Moon, WalletCards } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [LucideAngularModule, TranslatePipe],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  private readonly translate = inject(TranslateService);

  readonly Languages = Languages;
  readonly Moon = Moon;
  readonly WalletCards = WalletCards;

  readonly language = signal<'en' | 'fa'>(localStorage.getItem('language') === 'fa' ? 'fa' : 'en');

  readonly appearance = signal<'light' | 'dark'>(
    localStorage.getItem('appearance') === 'dark' ? 'dark' : 'light',
  );

  readonly currency = signal(localStorage.getItem('currency') || 'Toman');

  constructor() {
    const language = this.language();

    this.translate.use(language);

    document.documentElement.lang = language;

    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';

    const appearance = this.appearance();

    document.documentElement.classList.toggle('dark', appearance === 'dark');
  }

  setLanguage(value: 'en' | 'fa'): void {
    this.language.set(value);

    this.translate.use(value);

    document.documentElement.lang = value;

    document.documentElement.dir = value === 'fa' ? 'rtl' : 'ltr';

    localStorage.setItem('language', value);
  }

  setAppearance(value: 'light' | 'dark'): void {
    this.appearance.set(value);

    document.documentElement.classList.toggle('dark', value === 'dark');

    localStorage.setItem('appearance', value);
  }

  setCurrency(value: string): void {
    this.currency.set(value);

    localStorage.setItem('currency', value);
  }
}
