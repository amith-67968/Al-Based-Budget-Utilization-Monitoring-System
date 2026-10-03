import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();
  
  // Resolve base API URL (supports environment.apiUrl or runtime window.__API_URL__)
  let targetUrl = req.url;
  const baseUrl = (typeof window !== 'undefined' && (window as any).__API_URL__) || environment.apiUrl;

  if (baseUrl && targetUrl.startsWith('/api')) {
    targetUrl = `${baseUrl.replace(/\/$/, '')}${targetUrl}`;
  }

  let authReq = req.clone({ url: targetUrl });
  if (token) {
    authReq = authReq.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  
  return next(authReq).pipe(
    catchError(error => {
      if (error.status === 401) {
        authService.clearSession();
        if (router.url !== '/' && router.url !== '/home' && router.url !== '/login') {
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    })
  );
};
