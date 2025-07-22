import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// export interface DocumentDetail {
//     id: string;
//     title: string;
//     advantages: string[];
//     disadvantages: string[];
//     modifications: string[];
//     clauses: string[];
// }

@Injectable({
    providedIn: 'root'
})
export class RetrieveDocumentService {

  constructor(private http: HttpClient) {}

  getCategoryDocuments(categoryId: string): Observable<any> {
    const baseUrl = environment.apiUrl;
    const url = `${baseUrl}/categories/${categoryId}/documents`;
    return this.http.get<any>(url);
  }

  getDocumentById(categoryId: string, id: string): Observable<any> {
    const baseUrl = environment.apiUrl;
    const url = `${baseUrl}/categories/${categoryId}/documents/${id}`;
    return this.http.get<any>(url);
  }

}
