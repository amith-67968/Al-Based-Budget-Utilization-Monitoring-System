import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private apiUrl = '/api/reports';
  
  constructor(private http: HttpClient) {}

  private buildParams(params: any, format?: string): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    if (format) {
      httpParams = httpParams.set('format', format);
    }
    return httpParams;
  }

  getBudgetUtilization(params?: any, format?: string): Observable<any> {
    const httpParams = this.buildParams(params, format);
    if (format === 'csv' || format === 'pdf') {
      return this.http.get(`${this.apiUrl}/budget-utilization`, { params: httpParams, responseType: 'blob' });
    }
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/budget-utilization`, { params: httpParams });
  }

  getExpenditures(params?: any, format?: string): Observable<any> {
    const httpParams = this.buildParams(params, format);
    if (format === 'csv' || format === 'pdf') {
      return this.http.get(`${this.apiUrl}/expenditures`, { params: httpParams, responseType: 'blob' });
    }
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/expenditures`, { params: httpParams });
  }

  getAlerts(params?: any, format?: string): Observable<any> {
    const httpParams = this.buildParams(params, format);
    if (format === 'csv' || format === 'pdf') {
      return this.http.get(`${this.apiUrl}/alerts`, { params: httpParams, responseType: 'blob' });
    }
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/alerts`, { params: httpParams });
  }

  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
