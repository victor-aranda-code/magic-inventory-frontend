import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export function JWTInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const jwt = localStorage.getItem('jwt_token');

  console.log(`[HTTP Interceptor] Request to: ${request.url} | Token found: ${!!jwt}`);

  if (jwt) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${jwt}`
      }
    });
  }
  return next(request);
}
