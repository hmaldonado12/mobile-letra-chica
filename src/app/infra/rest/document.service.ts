import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get documents for a category
  getDocuments(categoryId: string): Observable<any> {
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json'
    });
    
    return this.http.get(`${this.apiUrl}/categories/${categoryId}/documents`, { headers });
  }

  // Get document by ID
  getDocumentById(categoryId: string, documentId: string): Observable<any> {
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json'
    });
    
    return this.http.get(`${this.apiUrl}/categories/${categoryId}/documents/${documentId}`, { headers });
  }

  // Save document
  saveDocument(categoryId: string, title: string, summary: string, userId: string, status: string = 'analyzed'): Observable<any> {
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json'
    });
    
    const body = {
      title,
      summary,
      userId,
      categoryId,
      status
    };
    
    return this.http.post(`${this.apiUrl}/categories/${categoryId}/documents`, body, { headers });
  }

  // Analyze document
  analyzeDocument(categoryId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
    
    return this.http.post(`${this.apiUrl}/categories/${categoryId}/documents/analyze`, formData, { headers });
  }

  // Reanalyze document
  reanalyzeDocument(categoryId: string, documentId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
    
    return this.http.put(`${this.apiUrl}/categories/${categoryId}/documents/${documentId}/analyze`, formData, { headers });
  }

  // Delete document
  deleteDocument(categoryId: string, documentId: string): Observable<any> {
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json'
    });
    
    return this.http.delete(`${this.apiUrl}/categories/${categoryId}/documents/${documentId}`, { headers });
  }
}
