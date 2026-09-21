import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Budget, ApiResponse, PaginatedResponse, DashboardStats } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private apiUrl = '/api/budgets';
  
  constructor(private http: HttpClient) {}

  getAll(params?: any): Observable<PaginatedResponse<Budget>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<PaginatedResponse<Budget>>(this.apiUrl, { params: httpParams });
  }

  getById(id: string): Observable<ApiResponse<Budget>> {
    return this.http.get<ApiResponse<Budget>>(`${this.apiUrl}/${id}`);
  }

  create(data: any): Observable<ApiResponse<Budget>> {
    return this.http.post<ApiResponse<Budget>>(this.apiUrl, data);
  }

  update(id: string, data: any): Observable<ApiResponse<Budget>> {
    return this.http.put<ApiResponse<Budget>>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }

  getDashboardStats(departmentId?: string): Observable<ApiResponse<DashboardStats>> {
    let params = new HttpParams();
    if (departmentId) {
      params = params.set('departmentId', departmentId);
    }
    return this.http.get<ApiResponse<DashboardStats>>(`${this.apiUrl}/dashboard-stats`, { params });
  }
}
