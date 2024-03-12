import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements HttpInterceptor {
  constructor(private router: Router) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = sessionStorage.getItem('auth-token');

    if (true) {
      // Clone the request and add the authorization header
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      return next.handle(authRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error, "HttpResp");

          if (error.error?.message === 'Unauthorized: Invalid token') {
            // Redirect to the login page
            Swal.fire('Authorization', 'Token Expired', 'error');
            sessionStorage.removeItem('auth-token')
            this.router.navigate(['/login']);
          } else if (error.error?.message === 'Unauthorized: No token provided') {
            // Redirect to the login page
            Swal.fire('Authorization', 'No Token Found', 'error');
            sessionStorage.removeItem('auth-token');
            this.router.navigate(['/login']);
          }
          return throwError(error);
        })
      );
    }

    // If there's no token, proceed with the original request
    return next.handle(request);
  }
}
