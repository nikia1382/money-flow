import { Component, signal } from '@angular/core';
import { Languages, Moon, WalletCards } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [LucideAngularModule, TranslatePipe],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  readonly Languages = Languages;
  readonly Moon = Moon;
  readonly WalletCards = WalletCards;

  readonly language = signal<'en' | 'fa'>('en');
  readonly appearance = signal<'light' | 'dark'>('light');
  readonly currency = signal('Toman');

  setLanguage(value: 'en' | 'fa'): void {
    this.language.set(value);
  }

  setAppearance(value: 'light' | 'dark'): void {
    this.appearance.set(value);
  }

  setCurrency(value: string): void {
    this.currency.set(value);
  }
}
