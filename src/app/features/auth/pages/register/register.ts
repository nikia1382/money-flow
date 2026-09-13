import {
  Component,
  inject,
  signal,
} from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import {
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
  UserRound,
  LucideAngularModule,
} from 'lucide-angular';

import {
  AuthService,
} from '../../services/auth.service';

/* =========================
   Password Match Validator
========================= */

const passwordsMatchValidator:
  ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const password =
      control.get('password')?.value;

    const confirmPassword =
      control.get(
        'confirmPassword',
      )?.value;

    if (
      !password ||
      !confirmPassword
    ) {
      return null;
    }

    return password === confirmPassword
      ? null
      : {
          passwordsMismatch: true,
        };
  };

@Component({
  selector: 'app-register',

  standalone: true,

  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    LucideAngularModule,
  ],

  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  /* =========================
     Dependencies
  ========================= */

  private readonly formBuilder =
    inject(FormBuilder);

  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);

  /* =========================
     Icons
  ========================= */

  readonly Landmark = Landmark;
  readonly UserRound = UserRound;
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

  readonly showConfirmPassword =
    signal(false);

  readonly errorMessageKey =
    signal<string | null>(null);

  readonly successMessageKey =
    signal<string | null>(null);

  /* =========================
     Form
  ========================= */

  readonly registerForm =
    this.formBuilder.nonNullable.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(100),
          ],
        ],

        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.maxLength(150),
          ],
        ],

        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(72),
          ],
        ],

        confirmPassword: [
          '',
          [
            Validators.required,
          ],
        ],
      },
      {
        validators:
          passwordsMatchValidator,
      },
    );

  /* =========================
     Password Visibility
  ========================= */

  togglePassword(): void {
    this.showPassword.update(
      (value) => !value,
    );
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(
      (value) => !value,
    );
  }

  /* =========================
     Submit
  ========================= */

  submit(): void {
    this.errorMessageKey.set(null);
    this.successMessageKey.set(null);

    if (
      this.registerForm.invalid ||
      this.isSubmitting()
    ) {
      this.registerForm.markAllAsTouched();

      return;
    }

    const formValue =
      this.registerForm.getRawValue();

    this.isSubmitting.set(true);

    this.authService
      .register({
        name: formValue.name.trim(),
        email:
          formValue.email
            .trim()
            .toLowerCase(),
        password: formValue.password,
      })
      .pipe(
        finalize(() => {
          this.isSubmitting.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.successMessageKey.set(
            'auth.register.success',
          );

          this.registerForm.reset();

          setTimeout(() => {
            this.router.navigateByUrl(
              '/login',
            );
          }, 1200);
        },

        error: (error) => {
          if (error.status === 409) {
            this.errorMessageKey.set(
              'auth.register.errors.emailExists',
            );

            return;
          }

          if (error.status === 400) {
            this.errorMessageKey.set(
              'auth.register.errors.validation',
            );

            return;
          }

          this.errorMessageKey.set(
            'auth.register.errors.general',
          );
        },
      });
  }
}