import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

export function JWTInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const jwt = localStorage.getItem('jwt_token');
  const router = inject(Router);

  //console.log(`[HTTP Interceptor] Request to: ${request.url} | Token found: ${!!jwt}`);

  if (jwt) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${jwt}`
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token is expired or invalid
        //console.warn('[HTTP Interceptor] 401 Unauthorized - Redirecting to login');
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
}
