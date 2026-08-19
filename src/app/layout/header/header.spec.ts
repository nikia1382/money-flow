import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Header } from './header';

import {
  provideTranslateService,
  provideTranslateLoader,
  TranslateLoader,
} from '@ngx-translate/core';

import { Observable, of } from 'rxjs';

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of({
      dashboard: {
        welcome: 'Welcome back',
        subtitle: 'Financial overview',
      },
    });
  }
}

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],

      providers: [
        provideTranslateService({
          loader: provideTranslateLoader(FakeLoader),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with notifications closed', () => {
    expect(component.isNotificationOpen()).toBeFalse();
  });

  it('should open notifications', () => {
    component.toggleNotifications();

    expect(component.isNotificationOpen()).toBeTrue();
  });

  it('should close notifications after second toggle', () => {
    component.toggleNotifications();

    expect(component.isNotificationOpen()).toBeTrue();

    component.toggleNotifications();

    expect(component.isNotificationOpen()).toBeFalse();
  });
  it('should show notification menu when notification button is clicked', () => {
    // دکمه Bell را از HTML پیدا می‌کنیم
    const notificationButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('.notification-btn');

    // مثل کاربر واقعی روی آن کلیک می‌کنیم
    notificationButton.click();

    // Angular صفحه را آپدیت می‌کند
    fixture.detectChanges();

    // حالا دنبال منوی Notification می‌گردیم
    const notificationMenu = fixture.nativeElement.querySelector('.notification-menu');

    // باید در صفحه وجود داشته باشد
    expect(notificationMenu).toBeTruthy();
  });
  it('should hide notification menu after clicking notification button twice', () => {
    const notificationButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('.notification-btn');

    // کلیک اول → باز
    notificationButton.click();
    fixture.detectChanges();

    let notificationMenu = fixture.nativeElement.querySelector('.notification-menu');

    expect(notificationMenu).toBeTruthy();

    // کلیک دوم → بسته
    notificationButton.click();
    fixture.detectChanges();

    notificationMenu = fixture.nativeElement.querySelector('.notification-menu');

    expect(notificationMenu).toBeFalsy();
  });
});
