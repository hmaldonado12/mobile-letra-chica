import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DeleteCategoryRepositoryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  deleteCategory(categoryId: string): Observable<any> {
    // NOTE: Este endpoint necesita el userId para funcionar correctamente
    // TODO: Modificar para recibir userId como parámetro
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json'
    });
    
    return this.http.delete(`${this.apiUrl}/categories/${categoryId}`, { headers });
  }
}

