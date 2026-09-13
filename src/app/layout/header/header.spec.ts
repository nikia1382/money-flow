import { TEST_PROVIDERS } from '@testing/test-providers';
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
         ...TEST_PROVIDERS,
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
    // Ø¯Ú©Ù…Ù‡ Bell Ø±Ø§ Ø§Ø² HTML Ù¾ÛŒØ¯Ø§ Ù…ÛŒâ€ŒÚ©Ù†ÛŒÙ…
    const notificationButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('.notification-btn');

    // Ù…Ø«Ù„ Ú©Ø§Ø±Ø¨Ø± ÙˆØ§Ù‚Ø¹ÛŒ Ø±ÙˆÛŒ Ø¢Ù† Ú©Ù„ÛŒÚ© Ù…ÛŒâ€ŒÚ©Ù†ÛŒÙ…
    notificationButton.click();

    // Angular ØµÙØ­Ù‡ Ø±Ø§ Ø¢Ù¾Ø¯ÛŒØª Ù…ÛŒâ€ŒÚ©Ù†Ø¯
    fixture.detectChanges();

    // Ø­Ø§Ù„Ø§ Ø¯Ù†Ø¨Ø§Ù„ Ù…Ù†ÙˆÛŒ Notification Ù…ÛŒâ€ŒÚ¯Ø±Ø¯ÛŒÙ…
    const notificationMenu = fixture.nativeElement.querySelector('.notification-menu');

    // Ø¨Ø§ÛŒØ¯ Ø¯Ø± ØµÙØ­Ù‡ ÙˆØ¬ÙˆØ¯ Ø¯Ø§Ø´ØªÙ‡ Ø¨Ø§Ø´Ø¯
    expect(notificationMenu).toBeTruthy();
  });
  it('should hide notification menu after clicking notification button twice', () => {
    const notificationButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('.notification-btn');

    // Ú©Ù„ÛŒÚ© Ø§ÙˆÙ„ â†’ Ø¨Ø§Ø²
    notificationButton.click();
    fixture.detectChanges();

    let notificationMenu = fixture.nativeElement.querySelector('.notification-menu');

    expect(notificationMenu).toBeTruthy();

    // Ú©Ù„ÛŒÚ© Ø¯ÙˆÙ… â†’ Ø¨Ø³ØªÙ‡
    notificationButton.click();
    fixture.detectChanges();

    notificationMenu = fixture.nativeElement.querySelector('.notification-menu');

    expect(notificationMenu).toBeFalsy();
  });
});

