import {
  ApplicationConfig,
} from '@angular/core';

import {
  provideRouter,
} from '@angular/router';

import {
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

import {
  provideTranslateService,
} from '@ngx-translate/core';

import {
  provideTranslateHttpLoader,
} from '@ngx-translate/http-loader';

import {
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';

import {
  routes,
} from './app.routes';

import {
  authInterceptor,
} from './core/interceptors/auth.interceptor';

export const appConfig:
  ApplicationConfig = {
    providers: [
      provideCharts(
        withDefaultRegisterables(),
      ),

      provideRouter(routes),

      provideHttpClient(
        withInterceptors([
          authInterceptor,
        ]),
      ),

      provideTranslateService({
        fallbackLang: 'en',

        loader:
          provideTranslateHttpLoader({
            prefix: '/i18n/',
            suffix: '.json',
          }),
      }),
    ],
  };