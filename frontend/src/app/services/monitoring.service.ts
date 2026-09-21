import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class MonitoringService {
  private apiUrl = '/api/monitoring';
  
  constructor(private http: HttpClient) {}

  getOverview(departmentId?: string, financialYear?: string): Observable<ApiResponse<any>> {
    let params = new HttpParams();
    if (departmentId) {
      params = params.set('departmentId', departmentId);
    }
    if (financialYear) {
      params = params.set('financialYear', financialYear);
    }
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/overview`, { params });
  }

  getDepartmentMonitoring(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/department/${id}`);
  }

  runMonitoring(): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/run`, {});
  }
}
