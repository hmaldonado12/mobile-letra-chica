import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CreateCategoryRepositoryService {
  private apiUrl = '/users';

  constructor(private http: HttpClient) {}

  createCategory(userId: string, name: string): Observable<any> {
    const baseUrl = environment.apiUrl
    this.apiUrl = baseUrl + this.apiUrl;
    const url = `${this.apiUrl}/${userId}/categories`;
    const body = { name };
    return this.http.post(url, body);
  }
}
