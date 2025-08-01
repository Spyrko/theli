import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DateTime } from 'ts-luxon';

export function timeStringToDate(time?: string): DateTime | undefined {
  if (!time) {
    return undefined;
  }
  return DateTime.fromFormat(time, "HH:mm", {zone: 'utc'});
}

export function dateToTimeString(date?: DateTime): string {
  if (!date) {
    return '';
  }
  const hours = date.hour.toString().padStart(2, '0');
  const minutes = date.minute.toString().padStart(2, '0');
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
  );
}

function convertToDateTime(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string' && isIsoDate(obj)) {
    return DateTime.fromISO(obj, {zone: 'utc'});
  }

  if (Array.isArray(obj)) {
    return obj.map(value => convertToDateTime(value));
  }

  if (typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = convertToDateTime(obj[key]);
    }
    return newObj;
  }

  return obj;
}

function isIsoDate(value: string): boolean {
  // Checks for ISO 8601 date strings like 2025-07-21T13:00:00Z
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?$/.test(value);
}
