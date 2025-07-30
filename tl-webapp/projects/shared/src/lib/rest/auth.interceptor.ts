import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from 'shared';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);
  const httpClient = inject(HttpClient);
  const accessToken = authService.getAccessToken();

  console.log("authInterceptor", req)

  const authReq = accessToken
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      console.warn("error caught", error)
      if (error.status === 401 && !isRefreshing) {
        isRefreshing = true;
        authService.removeAccessToken();

        const refreshedReq = authService.refreshAccessToken().then(() => {
          return req.clone({
            setHeaders: {
              Authorization: `Bearer ${authService.getAccessToken()}`,
            },
          });
        }).catch((err) => {
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
        // return from(refreshedReq).pipe(switchMap((newReq: void | HttpRequest<unknown>) => {
        //   if (newReq) {
        //     return httpClient.request(newReq);
        //   }
        //   return next(req);
        // }));
      }

      return throwError(() => error);
    })
  );
};
