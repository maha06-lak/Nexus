import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { AppRecord, RecordsResponse } from '../models';

export { AppRecord, RecordsResponse };

@Injectable({ providedIn: 'root' })
export class RecordService {
  private apiUrl = `${environment.apiUrl}/records`;
  constructor(private http: HttpClient) {}

  getAll(delayMs: number = 0): Observable<RecordsResponse> {
    let params = new HttpParams();
    if (delayMs > 0) params = params.set('delay', String(delayMs));
    return this.http.get<RecordsResponse>(this.apiUrl, { params });
  }

  getById(id: string): Observable<AppRecord> {
    return this.http.get<AppRecord>(`${this.apiUrl}/${id}`);
  }

  create(record: Partial<AppRecord>): Observable<any> {
    return this.http.post<any>(this.apiUrl, record);
  }

  update(id: string, record: Partial<AppRecord>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, record);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
