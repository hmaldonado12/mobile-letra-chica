import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentAnalysisRepositoryService {

  private apiUrl = 'http://localhost:8081/categories';

  constructor(private http: HttpClient) { }

  analyzeDocument(categoryId: string, file: File): Observable<any> {
    const url = `${this.apiUrl}/${categoryId}/documents/analyze`;
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(url, formData);
  }
}
