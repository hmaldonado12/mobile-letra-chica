import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGoogleRepositoryService {

  private apiUrl = 'http://localhost:8081/auth/google';

  constructor(private http: HttpClient) { }

  signInWithGoogle(idToken: string): Observable<any> {
    const body = { idToken };
    console.log('Sending ID Token to server:', idToken);
    const headers = { 'Content-Type': 'application/json' };
    const options = {
      headers: headers,
    }
    return this.http.post(this.apiUrl, body, options);
  }
}
