import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department, ApiResponse } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private apiUrl = '/api/departments';
  
  constructor(private http: HttpClient) {}

  getAll(params?: any): Observable<ApiResponse<Department[]>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<ApiResponse<Department[]>>(this.apiUrl, { params: httpParams });
  }

  getById(id: string): Observable<ApiResponse<Department>> {
    return this.http.get<ApiResponse<Department>>(`${this.apiUrl}/${id}`);
  }

  create(data: any): Observable<ApiResponse<Department>> {
    return this.http.post<ApiResponse<Department>>(this.apiUrl, data);
  }

  update(id: string, data: any): Observable<ApiResponse<Department>> {
    return this.http.put<ApiResponse<Department>>(`${this.apiUrl}/${id}`, data);
  }
}
