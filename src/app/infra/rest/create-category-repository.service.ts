import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CreateCategoryRepositoryService {
  private apiUrl = '/users';

  constructor(private http: HttpClient) {}

  createCategory(userId: string, name: string): Observable<any> {
    const baseUrl = environment.apiUrl;
    const url = `${baseUrl}/users/${userId}/categories`;
    const body = { name };
    
    // Headers para evitar la página de advertencia de ngrok
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json'
    });
    
    return this.http.post(url, body, { headers });
  }
}
