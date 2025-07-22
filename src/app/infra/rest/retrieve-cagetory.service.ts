import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
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
    return this.http.get<any>(url);
  }
}
