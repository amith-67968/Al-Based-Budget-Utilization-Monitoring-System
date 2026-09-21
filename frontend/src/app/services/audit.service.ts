import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditLog, PaginatedResponse } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class AuditService {
  private apiUrl = '/api/audit-logs';
  
  constructor(private http: HttpClient) {}

  getLogs(params?: any): Observable<PaginatedResponse<AuditLog>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<PaginatedResponse<AuditLog>>(this.apiUrl, { params: httpParams });
  }
}
