import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ActionHistory } from '../models/action-history.model';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private apiUrl = `${environment.apiUrl}/audit`;

  constructor(private http: HttpClient) { }

  getAllActions(): Observable<ActionHistory[]> {
    return this.http.get<ActionHistory[]>(this.apiUrl);
  }

  getUserActions(userId: number): Observable<ActionHistory[]> {
    return this.http.get<ActionHistory[]>(`${this.apiUrl}/user/${userId}`);
  }

  getActionsByDateRange(start: Date, end: Date): Observable<ActionHistory[]> {
    const startDate = start.toISOString();
    const endDate = end.toISOString();
    return this.http.get<ActionHistory[]>(`${this.apiUrl}/date-range?start=${startDate}&end=${endDate}`);
  }
}
