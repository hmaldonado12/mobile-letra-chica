import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SaveDocumentRepositoryService {
  private apiUrl = '/categories';

  constructor(private http: HttpClient) {}

  saveDocument(
    categoryId: string,
    title: string,
    summary: string,
    userId: string,
    status: string = 'successful'
  ): Observable<any> {
    const baseUrl = environment.apiUrl;
    const url = `${baseUrl}/categories/${categoryId}/documents`;
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
