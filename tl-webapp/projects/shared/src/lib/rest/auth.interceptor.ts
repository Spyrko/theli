import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from 'shared';
import { Router } from '@angular/router';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  const accessToken = authService.getAccessToken();

  const authReq = accessToken
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 403) {
        router.navigate(['/403'])
      }
      if (error.status === 401 && !isRefreshing) {
        isRefreshing = true;
        authService.removeAccessToken();

        const refreshedReq = authService.refreshAccessToken().then(() => {
          return req.clone({
            setHeaders: {
              Authorization: `Bearer ${authService.getAccessToken()}`,
            },
          });
        }).catch(() => {
          authService.logout();
        }).finally(() => {
          isRefreshing = false;
        })


        return from(refreshedReq).pipe(switchMap((newReq) => {
          if (newReq) {
            return next(newReq);
          } else {
            throw new Error("No new request created after token refresh");
          }
        }))
      }

      return throwError(() => error);
    })
  );
};
