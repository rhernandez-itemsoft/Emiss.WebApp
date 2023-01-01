
import {
  catchError, concatMap, firstValueFrom, map, Observable, of, retryWhen, tap, throwError
} from 'rxjs';
import { observeNotification } from 'rxjs/internal/Notification';
import { ApiName } from 'src/environment';

import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


///intercepta los errores
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(public router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(request)
      .pipe(


        catchError((_errorResponse: HttpErrorResponse): Observable<HttpErrorResponse> | any => {
          let _response: HttpErrorResponse;


          let _message = _errorResponse.message.replace(ApiName.Default, '');

          if (_errorResponse.status == 0) {
            _response = new HttpErrorResponse({ error: _errorResponse.error, headers: _errorResponse.headers, status: 503, statusText: 'El servidor no responde' });


          } else if (_errorResponse.status == 404) {
            _response = new HttpErrorResponse({ error: _errorResponse.error, headers: _errorResponse.headers, status: _errorResponse.status, statusText: 'No se encontraron coinciencias.' });

          } else {
            _response = new HttpErrorResponse({ error: _errorResponse.error, headers: _errorResponse.headers, status: _errorResponse.status, statusText: _message });
          }


          return throwError(() => _response);
        }),
      )

  }

}
