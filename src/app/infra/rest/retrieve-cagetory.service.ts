import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RetrieveCagetoryService {

  constructor(private http: HttpClient) {}

  getUserCategories(id: string): Observable<any> {
    const baseUrl = environment.apiUrl
    const url = `${baseUrl}/users/${id}/categories`;
    console.log('🌐 RetrieveCagetoryService - URL construida:', url);
    console.log('🔧 environment.apiUrl:', baseUrl);
    console.log('🆔 User ID:', id);
    
    // Headers para evitar la página de advertencia de ngrok
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json'
    });
    
    console.log('📡 Haciendo GET request a:', url);
    console.log('📋 Headers:', headers.keys());
    return this.http.get<any>(url, { headers });
  }
}
