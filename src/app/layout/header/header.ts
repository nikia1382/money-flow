import { Component, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {
  LucideAngularModule,
  Search,
  Plus,
  Bell,
  Moon,
  Sun,
  ChevronDown,
  CalendarDays
} from 'lucide-angular';

@Component({
  selector: 'app-header',
  imports: [
    LucideAngularModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  private readonly translate = inject(TranslateService);

  currentLang = 'en';

  readonly isDarkMode = signal(false);

  readonly Search = Search;
  readonly Plus = Plus;
  readonly Bell = Bell;
  readonly Moon = Moon;
  readonly Sun = Sun;
  readonly ChevronDown = ChevronDown;
  readonly CalendarDays = CalendarDays;


  constructor() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      this.isDarkMode.set(true);
      document.documentElement.classList.add('dark');
    }
  }


  changeLanguage(): void {
    this.currentLang =
      this.currentLang === 'en' ? 'fa' : 'en';

    this.translate.use(this.currentLang);

    document.documentElement.lang =
      this.currentLang;

    document.documentElement.dir =
      this.currentLang === 'fa'
        ? 'rtl'
        : 'ltr';
  }


  toggleDarkMode(): void {
    const nextValue = !this.isDarkMode();

    this.isDarkMode.set(nextValue);

    document.documentElement.classList.toggle(
      'dark',
      nextValue
    );

    localStorage.setItem(
      'theme',
      nextValue ? 'dark' : 'light'
    );
  }
}