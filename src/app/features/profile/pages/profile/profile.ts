import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  DatePipe,
} from '@angular/common';

import {
  FormsModule,
} from '@angular/forms';

import {
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';

import {
  CalendarDays,
  KeyRound,
  LucideAngularModule,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
} from 'lucide-angular';

import {
  AuthService,
} from '../../../auth/services/auth.service';

import {
  ToastService,
} from '../../../../shared/services/toast';

import {
  ProfileService,
} from '../../services/profile';

import {
  UserProfile,
} from '../../models/profile.model';

@Component({
  selector: 'app-profile',

  standalone: true,

  imports: [
    DatePipe,
    FormsModule,
    TranslatePipe,
    LucideAngularModule,
  ],

  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {

  private readonly profileService =
    inject(ProfileService);

  private readonly authService =
    inject(AuthService);

  private readonly toast =
    inject(ToastService);

  private readonly translate =
    inject(TranslateService);

  readonly UserRound = UserRound;
  readonly Mail = Mail;
  readonly ShieldCheck = ShieldCheck;
  readonly CalendarDays = CalendarDays;
  readonly Save = Save;
  readonly KeyRound = KeyRound;

  readonly profile =
    signal<UserProfile | null>(null);

  readonly isLoading =
    signal(true);

  readonly isSavingProfile =
    signal(false);

  readonly isChangingPassword =
    signal(false);

  name = '';

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  readonly userInitial =
    computed(() => {
      const name =
        this.profile()?.name.trim();

      return name
        ? name.charAt(0).toUpperCase()
        : 'U';
    });

  constructor() {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading.set(true);

    this.profileService
      .getProfile()
      .subscribe({
        next: (profile) => {
          this.profile.set(profile);
          this.name = profile.name;
          this.isLoading.set(false);
        },

        error: () => {
          this.isLoading.set(false);

          this.toast.error(
            this.translate.instant(
              'profile.toast.loadError',
            ),
          );
        },
      });
  }

  updateProfile(): void {
    const name =
      this.name.trim();

    if (name.length < 2) {
      this.toast.error(
        this.translate.instant(
          'profile.validation.name',
        ),
      );

      return;
    }

    this.isSavingProfile.set(true);

    this.profileService
      .updateProfile({
        name,
      })
      .subscribe({
        next: (updatedProfile) => {
          this.profile.set(
            updatedProfile,
          );

          this.name =
            updatedProfile.name;

          this.isSavingProfile.set(
            false,
          );

          this.authService
            .getCurrentUser()
            .subscribe();

          this.toast.success(
            this.translate.instant(
              'profile.toast.updated',
            ),
          );
        },

        error: () => {
          this.isSavingProfile.set(
            false,
          );

          this.toast.error(
            this.translate.instant(
              'profile.toast.updateError',
            ),
          );
        },
      });
  }

  changePassword(): void {
    if (
      !this.currentPassword ||
      this.newPassword.length < 8
    ) {
      this.toast.error(
        this.translate.instant(
          'profile.validation.password',
        ),
      );

      return;
    }

    if (
      this.newPassword !==
      this.confirmPassword
    ) {
      this.toast.error(
        this.translate.instant(
          'profile.validation.passwordMatch',
        ),
      );

      return;
    }

    this.isChangingPassword.set(true);

    this.profileService
      .changePassword({
        currentPassword:
          this.currentPassword,

        newPassword:
          this.newPassword,
      })
      .subscribe({
        next: () => {
          this.isChangingPassword.set(
            false,
          );

          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';

          this.toast.success(
            this.translate.instant(
              'profile.toast.passwordChanged',
            ),
          );
        },

        error: (error) => {
          this.isChangingPassword.set(
            false,
          );

          const message =
            error.status === 400
              ? 'profile.toast.currentPasswordError'
              : 'profile.toast.passwordError';

          this.toast.error(
            this.translate.instant(
              message,
            ),
          );
        },
      });
  }
}