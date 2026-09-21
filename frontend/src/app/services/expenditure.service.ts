import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expenditure, ApiResponse, PaginatedResponse } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class ExpenditureService {
  private apiUrl = '/api/expenditures';
  
  constructor(private http: HttpClient) {}

  getAll(params?: any): Observable<PaginatedResponse<Expenditure>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<PaginatedResponse<Expenditure>>(this.apiUrl, { params: httpParams });
  }

  getById(id: string): Observable<ApiResponse<Expenditure>> {
    return this.http.get<ApiResponse<Expenditure>>(`${this.apiUrl}/${id}`);
  }

  create(data: any): Observable<ApiResponse<Expenditure>> {
    return this.http.post<ApiResponse<Expenditure>>(this.apiUrl, data);
  }

  update(id: string, data: any): Observable<ApiResponse<Expenditure>> {
    return this.http.put<ApiResponse<Expenditure>>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }

  getRecent(limit?: number, departmentId?: string): Observable<ApiResponse<Expenditure[]>> {
    let params = new HttpParams();
    if (limit) params = params.set('limit', limit.toString());
    if (departmentId) params = params.set('departmentId', departmentId);
    
    return this.http.get<ApiResponse<Expenditure[]>>(`${this.apiUrl}/recent`, { params });
  }
}
