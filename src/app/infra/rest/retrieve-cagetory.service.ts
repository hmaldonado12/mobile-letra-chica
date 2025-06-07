import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RetrieveCagetoryService {
  private baseUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {}

  getUserCategories(id: string): Observable<any> {
    const url = `${this.baseUrl}/users/${id}/categories`;
    return this.http.get<any>(url);
  }
}
