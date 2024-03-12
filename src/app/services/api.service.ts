import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  // Common function for making GET requests
  get(endpoint: string): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.get(url);
  }

  // Common function for making POST requests
  post(endpoint: string, data: any): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, data, { headers });
  }
}
