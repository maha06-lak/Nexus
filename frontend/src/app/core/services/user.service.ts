import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) {}

  getAll(delayMs: number = 0): Observable<any[]> {
    let params = new HttpParams();
    if (delayMs > 0) params = params.set('delay', String(delayMs));
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  update(id: string, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, user);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  toggleStatus(id: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/toggle-status`, {});
  }
}
