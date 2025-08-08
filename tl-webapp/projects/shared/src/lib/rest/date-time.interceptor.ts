import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DateTime } from 'ts-luxon';

export function timeStringToDate(time?: string): DateTime | undefined {
  if (!time) {
    return undefined;
  }
  return DateTime.fromFormat(time, "HH:mm", {zone: 'local'});
}

export function dateToTimeString(date?: DateTime): string {
  if (!date) {
    return '';
  }

  const localDateTime = date.setZone('local');
  const hours = localDateTime.hour.toString().padStart(2, '0');
  const minutes = localDateTime.minute.toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}


export function dateTimeInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  return next(req).pipe(
    map(event => {
      if (event instanceof HttpResponse) {
        return event.clone({body: convertToDateTime(event.body)});
      }
      return event;
    })
  )
}

function convertToDateTime(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map(value => convertToDateTime(value));
  }

  if (typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      if (key === 'openingTime' || key === 'closingTime') {
        newObj[key] = obj[key] ? DateTime.fromISO(obj[key]) : undefined;
        continue;
      } else if (key === 'waitingTime') {
        newObj[key] = obj[key] ? new Date(obj[key]) : undefined;
        continue;
      }
      newObj[key] = convertToDateTime(obj[key]);
    }
    return newObj;
  }

  return obj;
}
