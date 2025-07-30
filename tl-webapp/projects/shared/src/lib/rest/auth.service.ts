import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpService, private router: Router) {
  }

  async login(loginData: { username: string, password: string }): Promise<void> {
    const {accessToken, refreshToken} = await this.http.post<{ accessToken: string, refreshToken: string }>("auth/login", loginData);
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
    return
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  logout(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
    this.router.navigate(['login']);
  }

  hasAuthority(authority: string): boolean {
    if (!authority) {
      return true; // If no authority is specified, assume access is granted
    }
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }
    // The token is a JWT and contains authorities in its payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.authorities && payload.authorities.includes(authority);
  }

  getAuthorities(): string[] {
    const token = this.getAccessToken();
    if (!token) {
      return [];
    }
    // The token is a JWT and contains authorities in its payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.authorities || [];
  }

  getUserName(): string | null {
    const token = this.getAccessToken();
    if (!token) {
      return null;
    }
    // The token is a JWT and contains subject in its payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || null;
  }

  getAccessToken(): string | null {
    return localStorage.getItem('token')
  }

  setAccessToken(token: string): void {
    localStorage.setItem('token', token)
  }

  removeAccessToken(): void {
    localStorage.removeItem('token');
  }

  setRefreshToken(token: string): void {
    localStorage.setItem('refreshToken', token)
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken')
  }

  removeRefreshToken(): void {
    localStorage.removeItem('refreshToken');
  }

  async refreshAccessToken() {
    const {accessToken, refreshToken} = await this.http.post<{ accessToken: string, refreshToken: string }>('auth/refresh', this.getRefreshToken())
    this.setAccessToken(accessToken)
    this.setRefreshToken(refreshToken)
    return
  }
}
