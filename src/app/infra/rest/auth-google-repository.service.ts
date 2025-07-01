import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthGoogleRepositoryService {

  private apiUrl = '/auth/google';

  constructor(private http: HttpClient) { }

  signInWithGoogle(idToken: string): Observable<any> {
    const fullUrl = environment.apiUrl + '/auth/google';
    const body = { idToken };
    console.log('🌐 URL completa del backend:', fullUrl);
    console.log('📦 Body de la petición:', JSON.stringify(body));
    console.log('🔗 Sending ID Token to server:', idToken);
    const headers = { 'Content-Type': 'application/json' };
    const options = {
      headers: headers,
    }
    return this.http.post(fullUrl, body, options);
  }
}
