import {
  Component,
  inject,
  signal,
} from '@angular/core';

import {
  Router,
  RouterOutlet,
} from '@angular/router';

import {
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';

import {
  Sidebar,
} from '../sidebar/sidebar';

import {
  Header,
} from '../header/header';

import {
  Toast,
} from '../../shared/components/toast/toast';

import {
  ConfirmDialog,
} from '../../shared/components/confirm-dialog/confirm-dialog';

import {
  ToastService,
} from '../../shared/services/toast';

import {
  AuthService,
} from '../../features/auth/services/auth.service';

@Component({
  selector: 'app-main-layout',

  imports: [
    RouterOutlet,
    Sidebar,
    Header,
    Toast,
    ConfirmDialog,
    TranslatePipe,
  ],

  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  /* =========================
     Dependencies
  ========================= */

  private readonly authService =
    inject(AuthService);

  private readonly toastService =
    inject(ToastService);

  private readonly translateService =
    inject(TranslateService);

  private readonly router =
    inject(Router);

  /* =========================
     State
  ========================= */

  readonly isSidebarOpen =
    signal(false);

  readonly isLogoutDialogOpen =
    signal(false);

  readonly isLoggingOut =
    signal(false);

  /* =========================
     Sidebar
  ========================= */

  openSidebar(): void {
    this.isSidebarOpen.set(true);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update(
      (value) => !value,
    );
  }

  /* =========================
     Logout Dialog
  ========================= */

  openLogoutDialog(): void {
    this.closeSidebar();

    this.isLogoutDialogOpen.set(
      true,
    );
  }

  cancelLogout(): void {
    if (this.isLoggingOut()) {
      return;
    }

    this.isLogoutDialogOpen.set(
      false,
    );
  }

  /* =========================
     Logout
  ========================= */

  confirmLogout(): void {
    if (this.isLoggingOut()) {
      return;
    }

    this.isLoggingOut.set(true);

    this.authService
      .logout()
      .subscribe({
        next: () => {
          this.finishLogout(
            'auth.logout.success',
            'success',
          );
        },

        error: () => {
          /*
           * AuthService حتی هنگام خطای سرور
           * اطلاعات نشست محلی را پاک می‌کند.
           */
          this.finishLogout(
            'auth.logout.localSuccess',
            'warning',
          );
        },
      });
  }

  private finishLogout(
    messageKey: string,
    type: 'success' | 'warning',
  ): void {
    this.isLoggingOut.set(false);

    this.isLogoutDialogOpen.set(
      false,
    );

    this.router
      .navigateByUrl('/login')
      .then(() => {
        const message =
          this.translateService.instant(
            messageKey,
          );

        if (type === 'success') {
          this.toastService.success(
            message,
          );

          return;
        }

        this.toastService.warning(
          message,
        );
      });
  }
}