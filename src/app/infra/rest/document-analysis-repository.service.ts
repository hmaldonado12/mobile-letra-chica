import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DocumentAnalysisRepositoryService {

  private apiUrl = '/categories';

  constructor(private http: HttpClient) { }

  analyzeDocument(categoryId: string, file: File): Observable<any> {
    const baseUrl = environment.apiUrl;
    const url = `${baseUrl}/categories/${categoryId}/documents/analyze`;
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(url, formData);
  }
}
