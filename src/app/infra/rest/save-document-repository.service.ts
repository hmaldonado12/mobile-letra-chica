import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaveDocumentRepositoryService {
  private apiUrl = 'http://localhost:8081/categories';

  constructor(private http: HttpClient) {}

  saveDocument(
    categoryId: string,
    title: string,
    summary: string,
    userId: string,
    status: string = 'successful'
  ): Observable<any> {
    const url = `${this.apiUrl}/${categoryId}/documents`;
    const body = {
      title,
      summary,
      userId,
      categoryId,
      status
    };
    return this.http.post(url, body);
  }
}
