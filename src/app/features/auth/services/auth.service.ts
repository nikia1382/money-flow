import {
  computed,
  inject,
  Injectable,
  signal,
} from '@angular/core';

import {
  HttpClient,
} from '@angular/common/http';

import {
  Observable,
  finalize,
  of,
  tap,
} from 'rxjs';

import {
  AuthResponse,
  AuthUser,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
} from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /* =========================
     Dependencies
  ========================= */

  private readonly http =
    inject(HttpClient);

  /* =========================
     API
  ========================= */

  private readonly apiUrl =
    'http://localhost:8080/api/auth';

  /* =========================
     Storage Keys
  ========================= */

  private readonly accessTokenKey =
    'moneyflow_access_token';

  private readonly refreshTokenKey =
    'moneyflow_refresh_token';

  private readonly userKey =
    'moneyflow_user';

  /* =========================
     State
  ========================= */

  private readonly accessTokenState =
    signal<string | null>(
      localStorage.getItem(
        this.accessTokenKey,
      ),
    );

  private readonly refreshTokenState =
    signal<string | null>(
      localStorage.getItem(
        this.refreshTokenKey,
      ),
    );

  readonly user =
    signal<AuthUser | null>(
      this.readStoredUser(),
    );

  readonly isAuthenticated =
    computed(
      () =>
        this.accessTokenState() !==
          null &&
        this.user() !== null,
    );

  /* =========================
     Register
  ========================= */

  register(
    request: RegisterRequest,
  ): Observable<AuthUser> {
    return this.http.post<AuthUser>(
      `${this.apiUrl}/register`,
      request,
    );
  }

  /* =========================
     Login
  ========================= */

  login(
    request: LoginRequest,
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}/login`,
        request,
      )
      .pipe(
        tap((response) => {
          this.saveSession(response);
        }),
      );
  }

  /* =========================
     Current User
  ========================= */

  getCurrentUser(): Observable<AuthUser> {
    return this.http
      .get<AuthUser>(
        `${this.apiUrl}/me`,
      )
      .pipe(
        tap((user) => {
          this.user.set(user);

          localStorage.setItem(
            this.userKey,
            JSON.stringify(user),
          );
        }),
      );
  }

  /* =========================
     Refresh
  ========================= */

  refreshAccessToken():
    Observable<AuthResponse> {
    const refreshToken =
      this.getRefreshToken();

    if (!refreshToken) {
      this.clearSession();

      throw new Error(
        'Refresh token is unavailable',
      );
    }

    const request:
      RefreshTokenRequest = {
        refreshToken,
      };

    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}/refresh`,
        request,
      )
      .pipe(
        tap((response) => {
          this.saveSession(response);
        }),
      );
  }

  /* =========================
     Logout
  ========================= */

  logout(): Observable<void> {
    const refreshToken =
      this.getRefreshToken();

    if (!refreshToken) {
      this.clearSession();

      return of(undefined);
    }

    const request:
      RefreshTokenRequest = {
        refreshToken,
      };

    return this.http
      .post<void>(
        `${this.apiUrl}/logout`,
        request,
      )
      .pipe(
        finalize(() => {
          this.clearSession();
        }),
      );
  }

  /* =========================
     Tokens
  ========================= */

  getAccessToken(): string | null {
    return this.accessTokenState();
  }

  getRefreshToken(): string | null {
    return this.refreshTokenState();
  }

  /* =========================
     Save Session
  ========================= */

  private saveSession(
    response: AuthResponse,
  ): void {
    this.accessTokenState.set(
      response.accessToken,
    );

    this.refreshTokenState.set(
      response.refreshToken,
    );

    this.user.set(
      response.user,
    );

    localStorage.setItem(
      this.accessTokenKey,
      response.accessToken,
    );

    localStorage.setItem(
      this.refreshTokenKey,
      response.refreshToken,
    );

    localStorage.setItem(
      this.userKey,
      JSON.stringify(
        response.user,
      ),
    );
  }

  /* =========================
     Clear Session
  ========================= */

  clearSession(): void {
    this.accessTokenState.set(null);
    this.refreshTokenState.set(null);
    this.user.set(null);

    localStorage.removeItem(
      this.accessTokenKey,
    );

    localStorage.removeItem(
      this.refreshTokenKey,
    );

    localStorage.removeItem(
      this.userKey,
    );
  }

  /* =========================
     Restore User
  ========================= */

  private readStoredUser():
    AuthUser | null {
    const storedUser =
      localStorage.getItem(
        this.userKey,
      );

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(
        storedUser,
      ) as AuthUser;
    } catch {
      localStorage.removeItem(
        this.userKey,
      );

      return null;
    }
  }
}