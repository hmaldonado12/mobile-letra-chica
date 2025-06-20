import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateCategoryRepositoryService {
  private apiUrl = 'http://localhost:8081/users';

  constructor(private http: HttpClient) {}

  createCategory(userId: string, name: string): Observable<any> {
    const url = `${this.apiUrl}/${userId}/categories`;
    const body = { name };
    return this.http.post(url, body);
  }
}
