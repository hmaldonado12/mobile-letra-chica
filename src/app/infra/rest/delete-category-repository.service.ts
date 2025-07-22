import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DeleteCategoryRepositoryService {
  private apiUrl = 'https://letra-chica-api.fly.dev/api/v1/categories';

  constructor(private http: HttpClient) {}

  deleteCategory(categoryId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${categoryId}`);
  }
}

