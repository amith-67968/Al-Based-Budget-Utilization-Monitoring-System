import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alert, ApiResponse, PaginatedResponse, AlertStats } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private apiUrl = '/api/alerts';
  
  constructor(private http: HttpClient) {}

  getAll(params?: any): Observable<PaginatedResponse<Alert>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<PaginatedResponse<Alert>>(this.apiUrl, { params: httpParams });
  }

  getById(id: string): Observable<ApiResponse<Alert>> {
    return this.http.get<ApiResponse<Alert>>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: string, status: string): Observable<ApiResponse<Alert>> {
    return this.http.patch<ApiResponse<Alert>>(`${this.apiUrl}/${id}/status`, { status });
  }

  getRecent(limit?: number, departmentId?: string): Observable<ApiResponse<Alert[]>> {
    let params = new HttpParams();
    if (limit) params = params.set('limit', limit.toString());
    if (departmentId) params = params.set('departmentId', departmentId);
    
    return this.http.get<ApiResponse<Alert[]>>(`${this.apiUrl}/recent`, { params });
  }

  getStats(departmentId?: string): Observable<ApiResponse<AlertStats>> {
    let params = new HttpParams();
    if (departmentId) params = params.set('departmentId', departmentId);
    
    return this.http.get<ApiResponse<AlertStats>>(`${this.apiUrl}/stats`, { params });
  }
}
