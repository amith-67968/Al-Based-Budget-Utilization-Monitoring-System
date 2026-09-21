import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, ApiResponse, PaginatedResponse } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = '/api/users';
  
  constructor(private http: HttpClient) {}

  getAll(params?: any): Observable<PaginatedResponse<User>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<PaginatedResponse<User>>(this.apiUrl, { params: httpParams });
  }

  getById(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/${id}`);
  }

  create(data: any): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(this.apiUrl, data);
  }

  update(id: string, data: any): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/${id}`, data);
  }

  updateStatus(id: string, status: string): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.apiUrl}/${id}/status`, { status });
  }
}
