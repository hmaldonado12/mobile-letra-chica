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
    const baseUrl = environment.apiUrl
    this.apiUrl = baseUrl + this.apiUrl;
    const body = { idToken };
    console.log('Sending ID Token to server:', idToken);
    const headers = { 'Content-Type': 'application/json' };
    const options = {
      headers: headers,
    }
    return this.http.post(this.apiUrl, body, options);
  }
}
