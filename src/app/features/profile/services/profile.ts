import {
  inject,
  Injectable,
} from '@angular/core';

import {
  HttpClient,
} from '@angular/common/http';

import {
  Observable,
} from 'rxjs';

import {
  ChangePasswordRequest,
  UpdateProfileRequest,
  UserProfile,
} from '../models/profile.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/users/me`;

  getProfile():
    Observable<UserProfile> {
    return this.http.get<UserProfile>(
      this.apiUrl,
    );
  }

  updateProfile(
    request: UpdateProfileRequest,
  ): Observable<UserProfile> {
    return this.http.put<UserProfile>(
      this.apiUrl,
      request,
    );
  }

  changePassword(
    request: ChangePasswordRequest,
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/password`,
      request,
    );
  }
}
