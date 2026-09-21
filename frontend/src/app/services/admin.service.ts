import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ThresholdRule, ApiResponse } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = '/api/admin';
  
  constructor(private http: HttpClient) {}

  getRules(): Observable<ApiResponse<ThresholdRule[]>> {
    return this.http.get<ApiResponse<ThresholdRule[]>>(`${this.apiUrl}/rules`);
  }

  createRule(data: any): Observable<ApiResponse<ThresholdRule>> {
    return this.http.post<ApiResponse<ThresholdRule>>(`${this.apiUrl}/rules`, data);
  }

  updateRule(id: string, data: any): Observable<ApiResponse<ThresholdRule>> {
    return this.http.put<ApiResponse<ThresholdRule>>(`${this.apiUrl}/rules/${id}`, data);
  }
}
