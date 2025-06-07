import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RetrieveInfoSessionService {

  constructor() { }

  getSessionInfoByKey(key: string): any {
    const value = sessionStorage.getItem(key);
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return value;
    }
  }
}
