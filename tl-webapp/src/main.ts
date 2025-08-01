import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { App } from './app/app';
import { provideRouter, Routes } from '@angular/router';
import { Login } from './app/auth/login/login';
import { Register } from './app/auth/register/register';
import { Logout } from './app/auth/logout/logout';
import { NotFound } from './app/err/not-found/not-found';
import { Overview } from './app/therapists/overview/overview';
import { AuthGuard, authInterceptor, dateTimeInterceptor } from 'shared';
import { Details } from './app/therapists/details/details';
import { provideTranslocoConfig } from './app/config/transloco.config';
import { provideSharedLibConfig } from './app/config/sharedLib.config';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { de } from 'date-fns/locale';
import { Forbidden } from './app/err/forbidden/forbidden';

const routes: Routes = [
  {path: 'login', component: Login},
  {path: 'logout', component: Logout},
  {path: 'register', component: Register},
  {path: 'therapists', component: Overview, canActivate: [AuthGuard]},
  {path: 'therapists/:id', component: Details, canActivate: [AuthGuard]},
  {path: '403', component: Forbidden},
  {path: '404', component: NotFound},
  {path: '', redirectTo: '/therapists', pathMatch: 'full'},
  {path: '**', redirectTo: '/404'},
];

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([dateTimeInterceptor, authInterceptor])),
    provideTranslocoConfig(),
    provideSharedLibConfig(),
    provideDateFnsAdapter(),
    {provide: MAT_DATE_LOCALE, useValue: de}],

});
