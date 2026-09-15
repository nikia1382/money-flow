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

@Injectable({
  providedIn: 'root',
})
export class ProfileService {

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8080/api/users/me';

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