import {
  inject,
} from '@angular/core';

import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';

import {
  Router,
} from '@angular/router';

import {
  Observable,
  catchError,
  finalize,
  shareReplay,
  switchMap,
  throwError,
} from 'rxjs';

import {
  AuthResponse,
} from '../../features/auth/models/auth.model';

import {
  AuthService,
} from '../../features/auth/services/auth.service';

/* =========================
   Public Auth Endpoints
========================= */

const publicAuthEndpoints = [
  '/api/auth/register',
  '/api/auth/login',
  '/api/auth/refresh',
  '/api/auth/logout',
];

/*
 * اگر چند درخواست هم‌زمان 401 بگیرند،
 * فقط یک درخواست Refresh ارسال می‌شود.
 */
let refreshRequest$:
  Observable<AuthResponse> | null =
    null;

/* =========================
   Interceptor
========================= */

export const authInterceptor:
  HttpInterceptorFn = (
    request,
    next,
  ) => {
    const authService =
      inject(AuthService);

    const router =
      inject(Router);

    const isPublicRequest =
      isPublicAuthRequest(
        request.url,
      );

    const accessToken =
      authService.getAccessToken();

    const requestToSend =
      !isPublicRequest &&
      accessToken
        ? addAccessToken(
            request,
            accessToken,
          )
        : request;

    return next(requestToSend).pipe(
      catchError(
        (
          error:
            HttpErrorResponse,
        ) => {
          const shouldRefresh =
            error.status === 401 &&
            !isPublicRequest &&
            authService
              .getRefreshToken() !==
              null;

          if (!shouldRefresh) {
            return throwError(
              () => error,
            );
          }

          return refreshAndRetry(
            request,
            next,
            authService,
            router,
          );
        },
      ),
    );
  };

/* =========================
   Refresh And Retry
========================= */

function refreshAndRetry(
  originalRequest:
    HttpRequest<unknown>,

  next:
    HttpHandlerFn,

  authService:
    AuthService,

  router:
    Router,
): Observable<
  ReturnType<HttpHandlerFn> extends
    Observable<infer T>
      ? T
      : never
> {
  if (!refreshRequest$) {
    refreshRequest$ =
      authService
        .refreshAccessToken()
        .pipe(
          catchError(
            (
              refreshError:
                HttpErrorResponse,
            ) => {
              authService
                .clearSession();

              router.navigate(
                ['/login'],
                {
                  queryParams: {
                    returnUrl:
                      router.url,
                  },
                },
              );

              return throwError(
                () => refreshError,
              );
            },
          ),

          finalize(() => {
            refreshRequest$ = null;
          }),

          shareReplay({
            bufferSize: 1,
            refCount: false,
          }),
        );
  }

  return refreshRequest$.pipe(
    switchMap(
      (
        response:
          AuthResponse,
      ) => {
        const retriedRequest =
          addAccessToken(
            originalRequest,
            response.accessToken,
          );

        return next(
          retriedRequest,
        );
      },
    ),
  );
}

/* =========================
   Add Authorization Header
========================= */

function addAccessToken(
  request:
    HttpRequest<unknown>,

  accessToken:
    string,
): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      Authorization:
        `Bearer ${accessToken}`,
    },
  });
}

/* =========================
   Public Request Check
========================= */

function isPublicAuthRequest(
  url: string,
): boolean {
  return publicAuthEndpoints.some(
    (endpoint) =>
      url.includes(endpoint),
  );
}