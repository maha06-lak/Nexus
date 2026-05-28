import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

import { User, AuthResponse } from '../models';

export { User, AuthResponse };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private TOKEN_KEY = 'nexus_token';
  private USER_KEY = 'nexus_user';
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(userId: string, password: string, delayMs: number = 0): Observable<AuthResponse> {
    let params = new HttpParams();
    if (delayMs > 0) params = params.set('delay', String(delayMs));
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { userId, password }, { params }).pipe(
      tap((res) => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
        this.currentUserSubject.next(res.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getProfile(delayMs: number = 0): Observable<User> {
    let params = new HttpParams();
    if (delayMs > 0) params = params.set('delay', String(delayMs));
    return this.http.get<User>(`${this.apiUrl}/auth/profile`, { params });
  }

  getToken(): string | null { return localStorage.getItem(this.TOKEN_KEY); }
  isLoggedIn(): boolean { return !!this.getToken(); }
  get currentUser(): User | null { return this.currentUserSubject.value; }
  isAdmin(): boolean { return this.currentUser?.role === 'Admin'; }

  private getStoredUser(): User | null {
    try {
      const u = localStorage.getItem(this.USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  }
}
