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
  CreateSupportRequest,
  SupportRequestResponse,
} from '../models/support-request.model';

@Injectable({
  providedIn: 'root',
})
export class SupportRequestService {
  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8080/api/support-requests';

  createRequest(
    request: CreateSupportRequest,
  ): Observable<SupportRequestResponse> {
    return this.http.post<SupportRequestResponse>(
      this.apiUrl,
      request,
    );
  }
}