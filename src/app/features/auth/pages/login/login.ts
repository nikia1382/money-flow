import {
  Component,
  inject,
  signal,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
    ActivatedRoute,
  Router,
  RouterLink,
} from '@angular/router';

import {
  finalize,
} from 'rxjs';

import {
  TranslatePipe,
} from '@ngx-translate/core';

import {
  Eye,
  EyeOff,
  Landmark,
  LockKeyhole,
  Mail,
  LucideAngularModule,
} from 'lucide-angular';

import {
  AuthService,
} from '../../services/auth.service';
import { Toast } from '../../../../shared/components/toast/toast';

@Component({
  selector: 'app-login',

  standalone: true,

  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    LucideAngularModule,
    RouterLink,
    Toast
  ],

  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  /* =========================
     Dependencies
  ========================= */

  private readonly formBuilder =
    inject(FormBuilder);

  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);
    private readonly activatedRoute =
  inject(ActivatedRoute);

  /* =========================
     Icons
  ========================= */

  readonly Landmark = Landmark;
  readonly Mail = Mail;
  readonly LockKeyhole = LockKeyhole;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

  /* =========================
     State
  ========================= */

  readonly isSubmitting =
    signal(false);

  readonly showPassword =
    signal(false);

  readonly errorMessageKey =
    signal<string | null>(null);

  /* =========================
     Form
  ========================= */

  readonly loginForm =
    this.formBuilder.nonNullable.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
        ],
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
        ],
      ],
    });

  /* =========================
     Password Visibility
  ========================= */

  togglePasswordVisibility(): void {
    this.showPassword.update(
      (value) => !value,
    );
  }

  /* =========================
     Submit
  ========================= */

  submit(): void {
    this.errorMessageKey.set(null);

    if (
      this.loginForm.invalid ||
      this.isSubmitting()
    ) {
      this.loginForm.markAllAsTouched();

      return;
    }

    this.isSubmitting.set(true);

    this.authService
      .login(
        this.loginForm.getRawValue(),
      )
      .pipe(
        finalize(() => {
          this.isSubmitting.set(false);
        }),
      )
      .subscribe({
next: () => {
  const returnUrl =
    this.getSafeReturnUrl();

  this.router.navigateByUrl(
    returnUrl,
  );
},

        error: (error) => {
          if (error.status === 401) {
            this.errorMessageKey.set(
              'auth.login.errors.invalidCredentials',
            );

            return;
          }

          this.errorMessageKey.set(
            'auth.login.errors.general',
          );
        },
      });
  }
  /* =========================
   Return URL
========================= */

private getSafeReturnUrl(): string {
  const returnUrl =
    this.activatedRoute
      .snapshot
      .queryParamMap
      .get('returnUrl');

  if (!returnUrl) {
    return '/dashboard';
  }

  /*
   * فقط مسیرهای داخلی برنامه
   * اجازه Redirect دارند.
   */
  const isSafeInternalUrl =
    returnUrl.startsWith('/') &&
    !returnUrl.startsWith('//') &&
    !returnUrl.startsWith(
      '/login',
    ) &&
    !returnUrl.startsWith(
      '/register',
    );

  return isSafeInternalUrl
    ? returnUrl
    : '/dashboard';
}
}