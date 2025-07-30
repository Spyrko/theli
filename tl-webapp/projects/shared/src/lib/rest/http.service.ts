import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SharedLibConfig } from '../lib-config';

@Injectable({providedIn: 'root'})
export class HttpService {

  constructor(private http: HttpClient, private libConfig: SharedLibConfig) {
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    return firstValueFrom(
      this.http.post<T>(`${this.libConfig.apiUrl}/${endpoint}`, body)
    );
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    return firstValueFrom(
      this.http.put<T>(`${this.libConfig.apiUrl}/${endpoint}`, body)
    );
  }

  async get<T>(endpoint: string): Promise<T> {
    return firstValueFrom(
      this.http.get<T>(`${this.libConfig.apiUrl}/${endpoint}`)
    );
  }

  get headers(): { headers: HttpHeaders } | undefined {
    if (!localStorage.getItem('token')) {
      return undefined
    }
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      })
    }
  }
}
