import {
  Component,
  inject,
} from '@angular/core';

import {
  Languages,
  Moon,
  WalletCards,
  LucideAngularModule,
} from 'lucide-angular';

import {
  TranslatePipe,
} from '@ngx-translate/core';

import {
  AppAppearance,
  AppCurrency,
  AppLanguage,
  SettingsService,
} from '../../services/settings';

@Component({
  selector: 'app-settings',

  standalone: true,

  imports: [
    LucideAngularModule,
    TranslatePipe,
  ],

  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  /* =========================
     Service
  ========================= */

  private readonly settingsService =
    inject(SettingsService);

  /* =========================
     Icons
  ========================= */

  readonly Languages =
    Languages;

  readonly Moon =
    Moon;

  readonly WalletCards =
    WalletCards;

  /* =========================
     State
  ========================= */

  readonly language =
    this.settingsService.language;

  readonly appearance =
    this.settingsService.appearance;

  readonly currency =
    this.settingsService.currency;

  readonly isSaving =
    this.settingsService.isSaving;

  /* =========================
     Actions
  ========================= */

  setLanguage(
    value: AppLanguage,
  ): void {
    this.settingsService
      .setLanguage(value);
  }

  setAppearance(
    value: AppAppearance,
  ): void {
    this.settingsService
      .setAppearance(value);
  }

  setCurrency(
    value: AppCurrency,
  ): void {
    this.settingsService
      .setCurrency(value);
  }
}